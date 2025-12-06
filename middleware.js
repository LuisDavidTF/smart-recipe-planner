import { NextResponse } from 'next/server';

// CONSTANTS
// Centralizamos el nombre de la cookie para evitar "magic strings" dispersos.
const AUTH_COOKIE_NAME = 'auth_token';

// Rutas públicas de autenticación: Si el usuario ya tiene sesión, no debería verlas.
const PUBLIC_AUTH_ROUTES = ['/login', '/register'];

// Rutas protegidas: Requieren sesión activa obligatoriamente.
// Nota: Usamos verificación parcial en el matcher, pero definimos prefijos aquí para la lógica.
const PROTECTED_ROUTE_PREFIXES = ['/create-recipe', '/edit-recipe'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Verificación de Sesión (Edge Level)
  // Verificamos solo la existencia de la cookie para mantener la latencia baja en el Edge.
  // La validación criptográfica del token debe ocurrir en el backend/API o en Layouts server-side.
  const hasSession = request.cookies.has(AUTH_COOKIE_NAME);

  // 2. Manejo de Usuarios Autenticados en Rutas Públicas (Guest Guard)
  // Si el usuario ya está logueado e intenta acceder a login/register, lo redirigimos al dashboard/home
  // para mejorar la UX y evitar flujos de autenticación redundantes.
  if (hasSession && PUBLIC_AUTH_ROUTES.includes(pathname)) {
    // Usamos URL absoluta para asegurar compatibilidad en todos los entornos de despliegue.
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Protección de Rutas Privadas (Auth Guard)
  // Si el usuario NO tiene sesión y trata de acceder a una ruta protegida.
  const isTryingToAccessProtectedRoute = PROTECTED_ROUTE_PREFIXES.some(prefix => 
    pathname.startsWith(prefix)
  );

  if (!hasSession && isTryingToAccessProtectedRoute) {
    // Redirección al login.
    // TODO (Opcional): Podrías agregar ?callbackUrl=${pathname} para redirigirlo de vuelta tras loguearse.
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Continuar flujo normal
  return NextResponse.next();
}

// CONFIGURATION
// El matcher es crucial para el rendimiento: evita que el middleware se ejecute en
// archivos estáticos, imágenes o rutas API que no requieren intercepción.
export const config = {
  matcher: [
    /*
     * Match all protected routes paths.
     * Soporta rutas anidadas como /edit-recipe/123
     */
    '/create-recipe',
    '/edit-recipe/:path*',
    
    /*
     * IMPORTANTE: Incluimos las rutas de auth (/login, /register) 
     * para permitir que la lógica del paso 2 (Guest Guard) se ejecute.
     */
    '/login',
    '/register',
  ],
};