import { NextRequest } from 'next/server'
import auth from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    })
    
    if (!session) {
      return Response.json({ user: null }, { status: 200 })
    }
    
    return Response.json({ 
      user: {
        email: session.user.email,
        id: session.user.id,
        name: session.user.name
      }
    })
  } catch (error) {
    console.error('Error getting session:', error)
    return Response.json({ user: null }, { status: 200 })
  }
}