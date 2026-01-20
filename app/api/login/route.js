import { NextResponse } from 'next/server';
export const runtime = 'edge';
import { AuthService } from '@/lib/services/auth';
import { serialize } from 'cookie';

export const maxDuration = 60;
const TOKEN_NAME = 'auth_token';
const MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const data = await AuthService.login({ email, password });

    const responseData = data.data || data;
    const token = responseData.token;

    // Support nested user object or flat structure depending on API
    const user = responseData.user || {
      id: responseData.id,
      name: responseData.name,
      email: responseData.email,
    };

    if (!token) {
      return NextResponse.json(
        { message: 'La respuesta de la API no incluyó un token.' },
        { status: 500 }
      );
    }

    const serializedCookie = serialize(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: MAX_AGE,
      path: '/',
      sameSite: 'lax',
    });


    return NextResponse.json(
      { user: user },
      {
        status: 200,
        headers: {
          'Set-Cookie': serializedCookie,
        },
      }
    );

  } catch (error) {
    // Check if it's our structured error
    if (error.status) {
      return NextResponse.json(
        { message: error.message || 'Error de autenticación' },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message },
      { status: 500 }
    );
  }
}
