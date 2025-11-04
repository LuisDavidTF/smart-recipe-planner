import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@utils/constants';  

const TOKEN_NAME = 'auth_token';

export async function POST(request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_NAME);


  if (!tokenCookie) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const token = tokenCookie.value;
  const body = await request.json();
  let apiRes; 

  try {

    const endpoint = `${API_BASE_URL}/ai/generate-magic`; 
    
    apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });


    const text = await apiRes.text();


    if (!apiRes.ok) {
      let errorData;
      try {

        errorData = JSON.parse(text);
      } catch (e) {

        throw new Error(text.includes('DOCTYPE') ? 'El backend devolvió HTML.' : 'Error del backend.');
      }
      

      return NextResponse.json(
        { message: errorData.error || 'Error desconocido del backend' },
        { status: apiRes.status } 
      );
    }


    const data = JSON.parse(text); 
    

    return NextResponse.json(data.recipe);

  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    
    
    return NextResponse.json(
      { message: `Error interno del servidor: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}