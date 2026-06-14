// FILE: src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';
import type { SessionData } from '@/lib/session';

export async function POST(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    session.destroy();

    return NextResponse.json(
      { success: true, message: 'Logged out successfully.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[POST /api/auth/logout]', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Also support DELETE (used by AuthContext)
export async function DELETE(request: NextRequest) {
  return POST(request);
}
