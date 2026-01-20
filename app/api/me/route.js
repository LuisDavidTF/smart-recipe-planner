import { NextResponse } from 'next/server';
export const runtime = 'edge';
import { cookies } from 'next/headers';
import { AuthService } from '@/lib/services/auth';
import { serialize } from 'cookie';

const TOKEN_NAME = 'auth_token';

export async function GET(request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_NAME);

  if (!tokenCookie) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const token = tokenCookie.value;

  try {
    const user = await AuthService.me(token);

    return NextResponse.json({ user: user }, { status: 200 });

  } catch (error) {
    // If original error was 401 (token expired/invalid), clear cookie
    if (error.status === 401) {
      const serializedCookie = serialize(TOKEN_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
        path: '/',
        sameSite: 'lax',
      });

      return NextResponse.json(
        { message: error.message || 'Token inválido' },
        { status: 401, headers: { 'Set-Cookie': serializedCookie } }
      );
    }

    const status = error.status || 500;
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message },
      { status }
    );
  }
}