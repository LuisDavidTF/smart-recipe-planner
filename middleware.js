import { NextResponse } from 'next/server';

const TOKEN_NAME = 'auth_token'; // ¡El mismo nombre!

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Obtener la cookie
  const isAuthenticated = request.cookies.has(TOKEN_NAME);

  // 2. Definir rutas
  const authRoutes = ['/login', '/register'];
  const protectedRoutes = ['/create-recipe', '/edit-recipe'];

  // Redirigir si está logueado e intenta ir a login
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirigir si NO está logueado e intenta ir a ruta protegida
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configuración del Matcher
export const config = {
  matcher: [
    '/create-recipe',
    '/edit-recipe/:path*', // Cubre /edit-recipe/1, /edit-recipe/2, etc.
  ],
};