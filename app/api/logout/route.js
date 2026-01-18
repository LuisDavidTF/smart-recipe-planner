
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const TOKEN_NAME = 'auth_token';

export async function POST() {
  const serializedCookie = serialize(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/',
    sameSite: 'lax',
  });

  return NextResponse.json(
    { message: 'Sesión cerrada' },
    {
      status: 200,
      headers: {
        'Set-Cookie': serializedCookie,
      },
    }
  );
}

export async function GET(request) {
  const serializedCookie = serialize(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/',
    sameSite: 'lax',
  });

  const loginUrl = new URL('/login', request.url);
  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
  if (callbackUrl) {
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
  }

  const response = NextResponse.redirect(loginUrl);
  response.headers.set('Set-Cookie', serializedCookie);

  return response;
}