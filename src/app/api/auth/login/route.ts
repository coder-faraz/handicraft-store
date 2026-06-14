// FILE: src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { validateCredentials } from '@/lib/auth';
import { sessionOptions } from '@/lib/session';
import type { SessionData } from '@/lib/session';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await validateCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Write iron-session
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    session.userId = user.id;
    session.role = user.role;
    session.name = user.name;
    session.email = user.email;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        userId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        isLoggedIn: true,
      },
    });
  } catch (error: any) {
    console.error('[POST /api/auth/login]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
