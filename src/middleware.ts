// Middleware for Authentication and Route Protection
// Created for ULTRATHINK Plan - Fase 1

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

// Define protected routes
const protectedRoutes = [
  '/dashboard',
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
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(`[MIDDLEWARE] *** MIDDLEWARE EXECUTING FOR: ${pathname} ***`)

  try {
    // Get session cookie from BetterAuth
    const sessionCookie = getSessionCookie(request)
    console.log(`[MIDDLEWARE] Session cookie:`, sessionCookie ? 'EXISTS' : 'NULL')

    const isAuthenticated = !!sessionCookie
    
    // For admin check, we need to make an API call to get user info
    let userEmail: string | null = null
    if (isAuthenticated && adminRoutes.some(route => pathname.startsWith(route))) {
      // Only make the API call for admin routes
      const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      })
      
      if (response.ok) {
        const sessionData = await response.json()
        userEmail = sessionData?.user?.email
        console.log(`[MIDDLEWARE] User email from API:`, userEmail)
      }
    }

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
      // Check if user is admin and redirect accordingly
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['fobos.salmeron@gmail.com']
      const isAdmin = userEmail && adminEmails.includes(userEmail)
      const redirectUrl = isAdmin ? '/admin' : '/dashboard'
      console.log(`[MIDDLEWARE] Authenticated user on auth route, redirecting to: ${redirectUrl}`)
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
      console.log(`[MIDDLEWARE] Unauthenticated user on protected route, redirecting to login`)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Admin route protection
    if (isAdminRoute) {
      console.log(`[MIDDLEWARE] Admin route detected: ${pathname}`)
      console.log(`[MIDDLEWARE] Is authenticated: ${isAuthenticated}`)
      
      if (!isAuthenticated) {
        console.log(`[MIDDLEWARE] Not authenticated, redirecting to login`)
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Check if user is admin
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['fobos.salmeron@gmail.com']
      console.log(`[MIDDLEWARE] Admin emails from env: ${adminEmails}`)
      console.log(`[MIDDLEWARE] User email: ${userEmail}`)
      const isAdmin = userEmail && adminEmails.includes(userEmail)
      console.log(`[MIDDLEWARE] Is admin: ${isAdmin}`)

      if (!isAdmin) {
        console.log(`[MIDDLEWARE] Not admin, redirecting to dashboard`)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      console.log(`[MIDDLEWARE] Admin access granted`)
    }

    // Allow the request to continue
    return NextResponse.next()

  } catch (error) {
    console.error('[MIDDLEWARE] Error:', error)

    // If there's an error getting the session and it's a protected route,
    // redirect to login
    const isProtectedRoute = protectedRoutes.some(route =>
      pathname.startsWith(route)
    ) || adminRoutes.some(route =>
      pathname.startsWith(route)
    )

    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
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