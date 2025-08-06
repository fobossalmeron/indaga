// BetterAuth Configuration
// Created for ULTRATHINK Plan - Fase 1

import { betterAuth } from "better-auth"
import { magicLink } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { supabase, userOperations } from "./supabase"
import { Resend } from "resend"
import { Pool } from "pg"

// FIX: Handle SSL certificate issues for Supabase
// This is necessary for Supabase connections in production
if (process.env.NODE_ENV === 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
} else if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

console.log("--- [auth.ts] Loading ---")
const databaseUrl = process.env.VERCELDB__POSTGRES_PRISMA_URL

console.log(
  "DATABASE_URL:",
  databaseUrl ? "Loaded" : "NOT LOADED"
)

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// BetterAuth configuration
export default betterAuth({
  // Database configuration
  database: new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
    // Additional connection options for production
    ...(process.env.NODE_ENV === 'production' && {
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 20,
    }),
  }),

  // Email configuration (for Magic Links)
  emailAndPassword: {
    enabled: false, // We only use Magic Links in Phase 1
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false, // This is crucial for security
      },
    },
  },

  // Secret for session encryption
  secret: process.env.BETTER_AUTH_SECRET!,

  // Base URL - Dynamic based on request
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Trusted origins for Better Auth
  trustedOrigins: [
    "http://localhost:3000",
    "http://192.168.100.22:3000",
    "https://indaga.site",
    "https://www.indaga.site"
  ],

  // Plugins
  plugins: [
    admin({
      impersonationSessionDuration: 60 * 60 * 24, // 24 hours
    }),
    magicLink({
      // Email configuration will be handled by BetterAuth's default email service
      // In production, configure with your preferred email provider (Resend, SendGrid, etc.)
      sendMagicLink: async ({ email, url, token }, request) => {
        try {
          // For development, still log the magic link
          if (process.env.NODE_ENV === "development") {
            console.log("🔗 Magic Link for", email, ":", url)
            console.log("🔑 Token:", token)

            // Detect if request comes from network IP and adjust URL
            const host = request?.headers?.get?.('host');
            if (host && host.includes('192.168.100.22')) {
              url = url.replace('localhost:3000', '192.168.100.22:3000');
              console.log("🔗 Adjusted Magic Link for network access:", url);
            }
          }

          // Send email with Resend
          if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "your_resend_api_key_here") {
            await resend.emails.send({
              from: 'INDAGA <noreply@indaga.site>',
              to: email,
              subject: 'Inicia sesión en INDAGA',
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>Iniciar sesión en INDAGA</title>
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; background-color: #edf3fd; margin: 0; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <h1 style="color: #008a7e; margin: 0; font-weight: normal;">¡Hola!</h1>
                      <p style="font-size: 18px; color: #4d4e6a; margin: 10px 0;">Inicia sesión en <span style="font-weight: 600;">INDAGA</span></p>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin: 20px 0;">
                    <p style="margin: 0 0 20px; font-size: 16px; color: #4d4e6a;">
                      Haz clic en el siguiente enlace para iniciar sesión en INDAGA:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${url}" style="display: inline-block; padding: 16px 32px; background-color: #008a7e; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
                        🔗 Iniciar sesión
                      </a>
                    </div>
                    
                    <p style="margin: 20px 0 0; font-size: 14px; color: #4d4e6a;">
                      ⏰ Este enlace expira en <strong>10 minutos</strong>.
                    </p>
                  </div>
                  
                  <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                      🏆 <strong>¡No olvides explorar el Treasure Hunt 2025!</strong><br>
                      Escanea códigos QR por Monterrey y colecciona tesoros únicos durante el Festival Santa Lucía.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                      Si no solicitaste este enlace, puedes ignorar este email.
                    </p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #9ca3af;">
                      INDAGA - Explora Monterrey como nunca antes
                    </p>
                  </div>
                  </div>
                </body>
                </html>
              `
            })

            console.log("✅ Magic link email sent successfully to:", email)
          } else {
            console.log("⚠️ RESEND_API_KEY not configured, email not sent")
            console.log("🔗 Magic Link:", url)
          }
        } catch (error) {
          console.error("❌ Error sending magic link email:", error)
          // Don't throw error to avoid breaking the auth flow
          // In development, we still log the link
          if (process.env.NODE_ENV === "development") {
            console.log("🔗 Fallback Magic Link:", url)
          }
        }
      },

      // Magic link expiration (10 minutes)
      expiresIn: 10 * 60, // 10 minutes
    }),
  ],

  // Callbacks and hooks
  callbacks: {
    async onSignUp({ user, request }: { user: any; request: any }) {
      console.log("[onSignUp] Hook triggered for user:", user.email);
      // Create user in Supabase when they sign up
      try {
        const result = await userOperations.createUser({
          email: user.email,
          full_name: user.name || "",
          provider: "magic-link",
        })
        console.log("[onSignUp] Supabase user creation result:", result);
        if (result.error) {
          console.error("[onSignUp] Error payload from Supabase:", result.error);
        }
      } catch (error) {
        console.error("[onSignUp] CATCH BLOCK: Error creating user in Supabase:", error);
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
      "http://192.168.100.22:3000",
      "https://indaga.site",
      "https://www.indaga.site",
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

    // Database configuration
    database: {
      // Generate secure session tokens
      generateId: () => {
        return crypto.randomUUID()
      },
    },
  },
})