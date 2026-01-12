import { NextResponse } from 'next/server';

/**
 * @typedef {import('next/server').NextRequest} NextRequest
 */

// CONSTANTS
const AUTH_COOKIE_NAME = 'auth_token';

// Public Authentication Routes: verified users should NOT access these.
const PUBLIC_AUTH_ROUTES = ['/login', '/register'];

// Protected Routes: Require an active session.
const PROTECTED_ROUTE_PREFIXES = ['/create-recipe', '/edit-recipe'];

/**
 * Middleware to handle session verification and route protection.
 * executed at the Edge.
 * 
 * @param {NextRequest} request 
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Session Check (Edge Level)
  // We check for the cookie existence for low-latency verification.
  const hasSession = request.cookies.has(AUTH_COOKIE_NAME);

  // 2. Guest Guard
  // Redirect authenticated users away from public auth pages (login/register)
  if (hasSession && PUBLIC_AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Auth Guard
  // Redirect unauthenticated users trying to access protected routes
  const isTryingToAccessProtectedRoute = PROTECTED_ROUTE_PREFIXES.some(prefix =>
    pathname.startsWith(prefix)
  );

  if (!hasSession && isTryingToAccessProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    // Optional: Add callbackUrl to preserve user destination
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Proceed
  return NextResponse.next();
}

// CONFIGURATION
export const config = {
  matcher: [
    /*
     * Match all protected routes paths.
     * Supports nested routes like /edit-recipe/123
     */
    '/create-recipe',
    '/edit-recipe/:path*',

    /*
     * Include auth routes to enable Guest Guard logic
     */
    '/login',
    '/register',
  ],
};