// Auth utilities for admin checks and routing
import { authClient } from './auth-client'
import { headers } from 'next/headers'
import auth from './auth'

// Check if current user is admin (client-side)
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const session = await authClient.getSession()
    if (!session?.data?.user) return false
    
    // Check if user has admin role
    return session.data.user.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Check if user is admin by email (server-side check)
export async function isAdminByEmail(email: string): Promise<boolean> {
  // List of admin emails - you can move this to env variables or database
  const adminEmails = [
    'fobos.salmeron@gmail.com',
    // Add more admin emails here
  ]
  
  return adminEmails.includes(email.toLowerCase())
}

// Get redirect URL based on user role
export async function getRedirectUrlForUser(email: string): Promise<string> {
  const isAdmin = await isAdminByEmail(email)
  return isAdmin ? '/admin' : '/dashboard'
}

// Server-side session check with redirect logic
export async function checkSessionAndRedirect() {
  try {
    const session = await authClient.getSession()
    
    if (!session?.data?.user) {
      return { redirect: '/login' }
    }
    
    const redirectUrl = await getRedirectUrlForUser(session.data.user.email)
    return { redirect: redirectUrl, user: session.data.user }
  } catch (error) {
    console.error('Error in session check:', error)
    return { redirect: '/login' }
  }
}

// Get current user ID from server-side session (for treasure hunt)
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const headersList = await headers()
    const session = await auth.api.getSession({
      headers: headersList
    })
    
    return session?.user?.id || null
  } catch (error) {
    console.error('Error getting current user ID:', error)
    return null
  }
}