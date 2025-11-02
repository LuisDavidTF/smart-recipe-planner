import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@utils/constants';

const TOKEN_NAME = 'auth_token';

// --- GET (Público, para ver una receta en el modal) ---
export async function GET(request, { params }) {
  const { id } = await params; // Arreglo para 'params is a Promise'
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_NAME);

  const headers = {}; // No 'Content-Type' en GET
  
  // Arreglo de "Público": Adjunta el token si existe, pero no falla si no.
  if (tokenCookie) {
    headers['Authorization'] = `Bearer ${tokenCookie.value}`;
  }

  try {
    const apiRes = await fetch(`${API_BASE_URL}/recipes/${id}`, {
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

// --- Función de ayuda PROTEGIDA para PATCH y DELETE ---
async function protectedRequest(request, endpoint) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_NAME);

  // ¡ESTA SÍ ES ESTRICTA!
  if (!tokenCookie) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const token = tokenCookie.value;
  const method = request.method;
  let body = null;
  
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  // Solo añade Content-Type si hay body
  if (method === 'PATCH') {
    body = await request.json();
    headers['Content-Type'] = 'application/json';
  }

  try {
    const apiRes = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (apiRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const text = await apiRes.text();
    const data = text ? JSON.parse(text) : null;

    return NextResponse.json(data, { status: apiRes.status });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno del servidor', error: error.message }, { status: 500 });
  }
}

// --- PATCH (Protegido, para Actualizar) ---
export async function PATCH(request, { params }) {
  const { id } = await params;
  return protectedRequest(request, `/recipes/${id}`);
}

// --- DELETE (Protegido, para Borrar) ---
export async function DELETE(request, { params }) {
  const { id } = await params;
  return protectedRequest(request, `/recipes/${id}`);
}