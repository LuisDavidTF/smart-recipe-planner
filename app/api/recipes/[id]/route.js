import { NextResponse } from 'next/server';
export const runtime = 'edge';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { RecipeService } from '@/lib/services/recipes';

const TOKEN_NAME = 'auth_token';

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const data = await RecipeService.getById(id);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { message: error.message || 'Error interno del servidor', error: error.message },
      { status }
    );
  }
}

async function protectedRequest(request, operation, id) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(TOKEN_NAME);

  if (!tokenCookie) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const token = tokenCookie.value;

  try {
    let data;
    if (operation === 'DELETE') {
      data = await RecipeService.delete(id, token);
    } else if (operation === 'PATCH') {
      const body = await request.json();
      data = await RecipeService.update(id, body, token);
    }

    // Invalidate the cache for the 'recipes' tag
    revalidateTag('recipes');

    if (data === null) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    const status = error.status || 500;
    return NextResponse.json(
      { message: error.message || 'Error interno del servidor', error: error.message },
      { status }
    );
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  return protectedRequest(request, 'PATCH', id);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  return protectedRequest(request, 'DELETE', id);
}