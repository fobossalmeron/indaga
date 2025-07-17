// Middleware for Authentication and Route Protection
// Created for ULTRATHINK Plan - Fase 1

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/qr-scanner',
  '/treasures', 
  '/saved-items',
  '/profile',
]

// Define admin routes
const adminRoutes = [
  '/admin',
]

// Define auth routes (redirect if already authenticated)
const authRoutes = [
  '/login',
  '/register',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  try {
    // Get session from BetterAuth
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    const isAuthenticated = !!session?.user
    const userEmail = session?.user?.email

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    )
    
    // Check if route is admin
    const isAdminRoute = adminRoutes.some(route => 
      pathname.startsWith(route)
    )
    
    // Check if route is auth
    const isAuthRoute = authRoutes.some(route => 
      pathname.startsWith(route)
    )

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Admin route protection
    if (isAdminRoute) {
      if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Check if user is admin
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
      const isAdmin = userEmail && adminEmails.includes(userEmail)
      
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Allow the request to continue
    return NextResponse.next()

  } catch (error) {
    console.error('Middleware error:', error)
    
    // If there's an error getting the session and it's a protected route,
    // redirect to login
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    ) || adminRoutes.some(route => 
      pathname.startsWith(route)
    )
    
    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // For non-protected routes, allow the request to continue
    return NextResponse.next()
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}