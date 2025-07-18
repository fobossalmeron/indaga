"use client"

import { useSession, signIn, signUp, signOut } from "@/lib/auth-client"

export const useAuth = () => {
  const session = useSession()
  
  return {
    data: session.data,
    isPending: session.isPending,
    error: session.error,
    signIn,
    signUp,
    signOut
  }
}

export default useAuth