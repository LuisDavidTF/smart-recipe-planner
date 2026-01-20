import { NextResponse } from 'next/server';
export const runtime = 'edge';
import { cookies } from 'next/headers';
import { RecipeService } from '@/lib/services/recipes';

const TOKEN_NAME = 'auth_token';

export async function POST(request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_NAME);


  if (!tokenCookie) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const token = tokenCookie.value;

  try {
    const body = await request.json();
    const { prompt } = body;

    // We expect the result to be the recipe object directly or wrapped in data?
    // RecipeService.generate returns the response body.
    // Docs say: 200 -> RecipeGenerateResponse (which is the recipe object fields)
    const data = await RecipeService.generate(prompt, token);

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { message: error.message || `Error interno del servidor`, error: error.message },
      { status }
    );
  }
}