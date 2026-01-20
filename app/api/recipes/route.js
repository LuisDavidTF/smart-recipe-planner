import { NextResponse } from 'next/server';
export const runtime = 'edge';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { RecipeService } from '@/lib/services/recipes';

const TOKEN_NAME = 'auth_token';


export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Convert URLSearchParams to object
  const params = Object.fromEntries(searchParams.entries());

  try {
    const data = await RecipeService.getAll(params);
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { message: error.message || 'Error interno del servidor', error: error.message },
      { status }
    );
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
    const data = await RecipeService.create(body, token);

    // Invalidate the cache for the 'recipes' tag
    revalidateTag('recipes');

    return NextResponse.json(data, { status: 201 }); // 201 Created

  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { message: error.message || 'Error interno del servidor', error: error.message },
      { status }
    );
  }
}