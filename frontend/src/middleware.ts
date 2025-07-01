import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que requerem autenticação
const protectedRoutes = [
  '/dashboard',
  '/dashboard/billing',
  '/dashboard/frauddetex',
  '/onboarding'
];

// Rotas que devem redirecionar usuários logados para o dashboard
const authRoutes = [
  '/login',
  '/signup',
  '/forgot-password'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Verificar se é uma rota de autenticação
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Se é uma rota protegida e o usuário não está autenticado
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se é uma rota de autenticação e o usuário já está logado
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}