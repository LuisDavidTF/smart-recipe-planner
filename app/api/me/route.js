import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Helper de Next.js para leer cookies
import { API_BASE_URL } from '@utils/constants';

const TOKEN_NAME = 'auth_token';

// ¡AQUÍ ESTÁ LA CORRECCIÓN!
export async function GET(request) {
  // 1. Obtener la cookie del servidor
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_NAME); // <-- Ahora esto funciona

  if (!tokenCookie) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const token = tokenCookie.value;

  try {
    // 2. Validar el token contra tu backend real
    const apiRes = await fetch(`${API_BASE_URL}/profile`, { // Ajusta este endpoint
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const userData = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: userData.message || 'Token inválido' },
        { status: 401 }
      );
    }

    // 3. Devolver los datos del usuario al cliente
    return NextResponse.json({ user: userData.data || userData }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}