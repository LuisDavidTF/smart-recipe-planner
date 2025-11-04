import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@utils/constants';
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
    const apiRes = await fetch(`${API_BASE_URL}/users/me`, { 
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store', 
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      
      const serializedCookie = serialize(TOKEN_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0), 
        path: '/',
        sameSite: 'lax',
      });
      
      return NextResponse.json(
        { message: errorData.message || 'Token inválido' },
        { status: apiRes.status, headers: { 'Set-Cookie': serializedCookie } }
      );
    }

    const user = await apiRes.json();

    return NextResponse.json({ user: user }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message },
      { status: 500 }
    );
  }
}