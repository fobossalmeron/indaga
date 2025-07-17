// BetterAuth Configuration
// Created for ULTRATHINK Plan - Fase 1

import { betterAuth } from "better-auth"
import { magicLink } from "better-auth/plugins"
import { supabase, userOperations } from "./supabase"

// BetterAuth configuration
export const auth = betterAuth({
  // Database configuration
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL || `postgresql://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '')}/postgres`,
  },

  // Email configuration (for Magic Links)
  emailAndPassword: {
    enabled: false, // We only use Magic Links in Phase 1
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // Secret for session encryption
  secret: process.env.BETTER_AUTH_SECRET!,

  // Base URL
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Plugins
  plugins: [
    magicLink({
      // Email configuration will be handled by BetterAuth's default email service
      // In production, configure with your preferred email provider (Resend, SendGrid, etc.)
      sendMagicLink: async ({ email, url, token }) => {
        // For development, log the magic link
        if (process.env.NODE_ENV === "development") {
          console.log("🔗 Magic Link for", email, ":", url)
          console.log("🔑 Token:", token)
        }

        // In production, replace this with your email service
        // Example with Resend:
        // await resend.emails.send({
        //   from: 'INDAGA <noreply@indaga.com>',
        //   to: email,
        //   subject: 'Inicia sesión en INDAGA',
        //   html: `
        //     <h1>¡Hola!</h1>
        //     <p>Haz clic en el siguiente enlace para iniciar sesión en INDAGA:</p>
        //     <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px;">
        //       Iniciar Sesión
        //     </a>
        //     <p>Este enlace expira en 10 minutos.</p>
        //     <p>Si no solicitaste este enlace, puedes ignorar este email.</p>
        //   `
        // })
      },
      
      // Magic link expiration (10 minutes)
      expiresIn: 10 * 60, // 10 minutes
    }),
  ],

  // User configuration
  user: {
    // Additional fields to store in the user table
    additionalFields: {
      full_name: {
        type: "string",
        required: true,
      },
      avatar_url: {
        type: "string",
        required: false,
      },
      email_verified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      provider: {
        type: "string",
        required: false,
        defaultValue: "magic-link",
      },
    },
  },

  // Callbacks and hooks
  callbacks: {
    async onSignUp({ user, request }: { user: any; request: any }) {
      // Create user in Supabase when they sign up
      try {
        await userOperations.createUser({
          email: user.email,
          full_name: user.name || user.email,
          provider: "magic-link",
        })
      } catch (error) {
        console.error("Error creating user in Supabase:", error)
      }
    },

    async onSignIn({ user, request }: { user: any; request: any }) {
      // Update user's email_verified status when they sign in via magic link
      try {
        await userOperations.updateUser(user.id, {
          email_verified: true,
        })
      } catch (error) {
        console.error("Error updating user in Supabase:", error)
      }
    },
  },

  // Allowed origins
  cors: {
    origin: [
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "http://localhost:3000",
    ],
    credentials: true,
  },

  // Rate limiting
  rateLimit: {
    window: 60, // 1 minute
    max: 10, // 10 requests per minute
  },

  // Advanced security options
  advanced: {
    // CSRF protection
    crossSubDomainCookies: {
      enabled: false, // Enable if using subdomains
    },
    
    // Generate secure session tokens
    generateId: () => {
      return crypto.randomUUID()
    },
  },
})

// Type exports for client-side usage
export type Session = typeof auth.$Infer.Session

// Server-side utilities
export const getSession = auth.api.getSession
export const signOut = auth.api.signOut

// Client configuration for better-auth/react
export const authConfig = {
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // Add any client-specific configuration here
}

export default auth