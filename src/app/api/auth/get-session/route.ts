import auth from '@/lib/auth'

export async function GET(request: Request) {
  // Preserve Better Auth's Set-Cookie headers, including browser recovery.
  return auth.handler(request)
}
