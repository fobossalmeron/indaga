export function getAuthTrustedOrigins(baseURL: string): string[] {
  const base = new URL(baseURL)
  const origins = new Set(['https://indaga.site', 'https://www.indaga.site', base.origin])

  // Local previews may run in production mode. Trust only the two loopback
  // aliases on the configured protocol/port, never arbitrary localhost ports.
  if (base.hostname === 'localhost' || base.hostname === '127.0.0.1') {
    for (const hostname of ['localhost', '127.0.0.1']) {
      const alias = new URL(base.origin)
      alias.hostname = hostname
      origins.add(alias.origin)
    }
  }

  return [...origins]
}
