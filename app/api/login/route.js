
import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@utils/constants';
import { serialize } from 'cookie';

export const maxDuration = 60; 
const TOKEN_NAME = 'auth_token';
const MAX_AGE = 60 * 60 * 24 * 7; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const apiRes = await fetch(`${API_BASE_URL}/users/login`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: data.message || 'Error de autenticación' },
        { status: apiRes.status }
      );
    }
    
    const responseData = data.data || data;
    const token = responseData.token;
    const user = {
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
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message },
      { status: 500 }
    );
  }
}
