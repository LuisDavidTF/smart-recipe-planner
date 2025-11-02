// app/api/logout/route.js
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const TOKEN_NAME = 'auth_token';

export async function POST() {
  const serializedCookie = serialize(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), 
    path: '/',
    sameSite: 'lax', // <-- ¡AQUÍ ESTÁ LA CORRECCIÓN!
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