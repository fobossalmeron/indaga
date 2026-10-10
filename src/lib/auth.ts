// BetterAuth Configuration
// Created for ULTRATHINK Plan - Fase 1

import { betterAuth } from "better-auth"
import { magicLink } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { supabase, userOperations } from "./supabase"
import { Resend } from "resend"
import { Pool } from "pg"
import { getAuthTrustedOrigins } from "./auth-origins"

// FIX: Handle SSL certificate issues for Supabase
// This is necessary for Supabase connections in production
if (process.env.NODE_ENV === 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
} else if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

console.log("--- [auth.ts] Loading ---")
const databaseUrl = process.env.VERCELDB_POSTGRES_PRISMA_URL || process.env.VERCELDB__POSTGRES_PRISMA_URL
const authBaseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const trustedOrigins = getAuthTrustedOrigins(authBaseURL)

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
    // The restored Supabase role has an empty search_path. Better Auth uses
    // unqualified table names, so select the schema on every pooled connection.
    options: '-c search_path=public',
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
    // Write directly to the existing table: the legacy "user" view cannot
    // satisfy UPDATE ... RETURNING when verifying a magic-link email.
    modelName: "users",
    fields: {
      name: "full_name",
      emailVerified: "email_verified",
      image: "avatar_url",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      role: {
        type: "string",
        input: false, // This is crucial for security
      },
    },
  },

  // Secret for session encryption
  secret: process.env.BETTER_AUTH_SECRET!,

  // Magic links and relative callbacks share this canonical origin.
  baseURL: authBaseURL,

  // Trusted origins for Better Auth
  trustedOrigins,

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
                  <style>
                    .indaga-login-button:hover {
                      background-color: #4c3569 !important;
                      color: #ffffff !important;
                    }
                    .indaga-login-button:focus-visible,
                    .indaga-login-button:active {
                      outline: 3px solid rgba(0, 138, 126, 0.5);
                      outline-offset: 0;
                    }
                    @media (prefers-reduced-motion: reduce) {
                      .indaga-login-button { transition: none !important; }
                    }
                  </style>
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #4d4e6a; background-color: #f8f6f2; margin: 0; padding: 12px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
                    <div style="text-align: center; margin-bottom: 20px;">
                      <h1 style="color: #65468b; margin: 0; font-weight: normal;">¡Hola!</h1>
                      <p style="font-size: 18px; color: #4d4e6a; margin: 10px 0;">Inicia sesión en <span style="font-weight: 600;">INDAGA</span></p>
                    </div>
                    
                    <div style="background: #f8f6f2; padding: 16px; border-radius: 12px; margin: 16px 0;">
                    <p style="margin: 0 0 16px; font-size: 16px; color: #4d4e6a;">
                      Haz clic en el siguiente enlace para iniciar sesión:
                    </p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                      <a class="indaga-login-button" href="${url}" style="display: inline-block; height: 44px; line-height: 44px; padding: 0 24px; background-color: #65468b; color: #ffffff; text-align: center; text-decoration: none; border-radius: 14px; font-weight: 448; font-size: 16px; white-space: nowrap; cursor: pointer; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);">
                        Iniciar&nbsp;sesión
                      </a>
                    </div>
                    
                    <p style="margin: 16px 0 0; font-size: 14px; color: #4d4e6a;">
                      ⏰ Este enlace expira en <strong>10 minutos</strong>.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                      Si no solicitaste este enlace, puedes ignorar este email.
                    </p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #9ca3af;">
                      INDAGA
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
    origin: trustedOrigins,
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
