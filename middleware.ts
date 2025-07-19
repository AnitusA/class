import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/api/auth/student', '/api/auth/admin']
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if accessing protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const verification = verifyToken(token)
    if (!verification.valid) {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.set('auth-token', '', { maxAge: 0 })
      return response
    }

    // Check admin access
    if (pathname.startsWith('/admin') && verification.payload?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Check student access
    if (pathname.startsWith('/dashboard') && !pathname.startsWith('/admin') && verification.payload?.role !== 'student') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
