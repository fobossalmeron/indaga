// BetterAuth API Route Handler
// Created for ULTRATHINK Plan - Fase 1

import auth from "@/lib/auth"

// Export the handler for all HTTP methods
export async function GET(request: Request) {
  return auth.handler(request)
}

export async function POST(request: Request) {
  return auth.handler(request)
}