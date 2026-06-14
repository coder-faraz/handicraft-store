// FILE: src/lib/auth.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

/**
 * Passport LocalStrategy — validates email + password credentials.
 * On success, attaches sanitized user object (no password) to the session.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false,
    },
    async (email: string, password: string, done) => {
      try {
        await connectDB();

        const user = await User.findOne({
          email: email.toLowerCase().trim(),
          isActive: true,
        }).select('+password');

        if (!user) {
          return done(null, false, {
            message: 'No account found with that email address.',
          });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return done(null, false, {
            message: 'Incorrect password. Please try again.',
          });
        }

        // Return sanitized user (no password in session)
        return done(null, {
          id: (user._id as any).toString(),
          role: user.role as 'admin' | 'customer',
          name: user.name,
          email: user.email,
        });
      } catch (error) {
        console.error('[Auth] LocalStrategy error:', error);
        return done(error);
      }
    }
  )
);

/**
 * Serialize user ID to session store.
 */
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

/**
 * Deserialize user from session by ID.
 */
passport.deserializeUser(async (id: string, done) => {
  try {
    await connectDB();
    const user = await User.findById(id).select('-password');
    if (!user) return done(null, false);
    done(null, {
      id: (user._id as any).toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    done(error);
  }
});

export default passport;

/**
 * Standalone credential validator — used in API route handlers
 * that manage their own iron-session (bypassing passport middleware).
 */
export async function validateCredentials(
  email: string,
  password: string
): Promise<{ id: string; role: 'admin' | 'customer'; name: string; email: string } | null> {
  await connectDB();

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
    isActive: true,
  }).select('+password');

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: (user._id as any).toString(),
    role: user.role as 'admin' | 'customer',
    name: user.name,
    email: user.email,
  };
}
