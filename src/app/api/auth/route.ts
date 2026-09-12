import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const passcode = body.passcode;
    const requiredPasscode = process.env.ADMIN_ACCESS_KEY || 'citemed2026';

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json(
        { authenticated: false, error: 'Passcode is required.' },
        { status: 400 }
      );
    }

    if (passcode.trim() === requiredPasscode.trim()) {
      const response = NextResponse.json({ authenticated: true });
      response.cookies.set({
        name: 'citemed_session',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    } else {
      return NextResponse.json(
        { authenticated: false, error: 'Incorrect passcode. Access denied.' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error?.message || 'Authentication failed.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('citemed_session')?.value;
  const isAuthenticated = sessionCookie === 'authenticated';
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.delete('citemed_session');
  return response;
}
