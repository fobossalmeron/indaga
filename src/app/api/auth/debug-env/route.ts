import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const envInfo = {
        NODE_ENV: process.env.NODE_ENV,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        // No mostrar valores sensibles
        hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
        hasResendKey: !!process.env.RESEND_API_KEY,
    }

    return Response.json(envInfo)
} 