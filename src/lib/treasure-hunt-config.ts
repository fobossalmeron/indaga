export const CURRENT_HUNT_YEAR = 2026
export const SUPPORTED_HUNT_YEARS = [2025, 2026] as const
export type HuntYear = typeof SUPPORTED_HUNT_YEARS[number]

export function parseHuntYear(value: unknown, fallback: HuntYear | null = CURRENT_HUNT_YEAR): HuntYear | null {
  if (value === undefined || value === null) return fallback
  if (value === 2025 || value === '2025') return 2025
  if (value === 2026 || value === '2026') return 2026
  return null
}

export function isPublicTreasureCode(code: unknown): code is string {
  return typeof code === 'string' && code.length <= 100 &&
    /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(code) && !/^\d{4}-/.test(code)
}

export function toStoredTreasureCode(year: number, code: string): string {
  if (!parseHuntYear(year) || !isPublicTreasureCode(code)) throw new Error('Código o edición inválidos')
  return year === 2025 ? code : `${year}-${code}`
}

export function toPublicTreasureCode(year: number, code: string): string {
  return year === 2025 ? code : code.replace(new RegExp(`^${year}-`), '')
}

export function treasurePath(year: number, code: string): string {
  return `/${year}/t/${toPublicTreasureCode(year, code)}`
}

export function getHuntAvailability(hunt: {
  start_date: string | null
  end_date: string | null
  is_active: boolean | null
}, now = new Date()): 'open' | 'upcoming' | 'ended' | 'inactive' {
  if (hunt.start_date && now.getTime() < Date.parse(hunt.start_date)) return 'upcoming'
  if (hunt.end_date && now.getTime() >= Date.parse(hunt.end_date)) return 'ended'
  return hunt.is_active ? 'open' : 'inactive'
}
