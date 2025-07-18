"use client"

import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins"
import { adminClient } from "better-auth/client/plugins"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type auth from "@/lib/auth"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
    magicLinkClient()
  ]
})

export const { useSession, signIn, signUp, signOut } = authClient