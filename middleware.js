import { NextResponse } from 'next/server';

const TOKEN_NAME = 'auth_token'; 

export function middleware(request) {
  const { pathname } = request.nextUrl;


  const isAuthenticated = request.cookies.has(TOKEN_NAME);

  const authRoutes = ['/login', '/register'];
  const protectedRoutes = ['/create-recipe', '/edit-recipe'];

  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/create-recipe',
    '/edit-recipe/:path*', 
  ],
};