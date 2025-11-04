import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@utils/constants';

const TOKEN_NAME = 'auth_token';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_NAME);

  const headers = {
    'Content-Type': 'application/json',
  };
  

  if (tokenCookie) {
    headers['Authorization'] = `Bearer ${tokenCookie.value}`;
  }

  try {

    const apiRes = await fetch(`${API_BASE_URL}/recipes?${searchParams.toString()}`, {
      method: 'GET',
      headers: headers,
    });

    const text = await apiRes.text();
    const data = text ? JSON.parse(text) : null;

    return NextResponse.json(data, { status: apiRes.status });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_NAME);

  if (!tokenCookie) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const token = tokenCookie.value;
  const body = await request.json();

  try {
    const apiRes = await fetch(`${API_BASE_URL}/recipes/create`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await apiRes.text();
    const data = text ? JSON.parse(text) : null;
    
    return NextResponse.json(data, { status: apiRes.status });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}