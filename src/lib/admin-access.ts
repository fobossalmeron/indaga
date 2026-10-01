import 'server-only'
import { headers } from 'next/headers'
import auth from './auth'
import { createServerSupabaseClient } from './supabase'

export async function requireAdminClient() {
  const session = await auth.api.getSession({ headers: await headers() })
  const allowed = (process.env.ADMIN_EMAILS || 'fobos.salmeron@gmail.com')
    .split(',').map(email => email.trim().toLowerCase())
  if (!session?.user || !allowed.includes(session.user.email.toLowerCase())) {
    throw new Error('Acceso no autorizado')
  }
  return createServerSupabaseClient()
}

type DbError = { message: string } | null
export type AdminClient = Awaited<ReturnType<typeof requireAdminClient>>

export async function readAllRows<T>(query: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: DbError }>): Promise<T[]> {
  const rows: T[] = []
  for (let from = 0; ; from += 500) {
    const { data, error } = await query(from, from + 499)
    if (error) throw new Error(error.message)
    if (!data) throw new Error('Respuesta de datos incompleta')
    rows.push(...data)
    if (data.length < 500) return rows
  }
}

export async function exactCount(query: PromiseLike<{ count: number | null; error: DbError }>): Promise<number> {
  const { count, error } = await query
  if (error) throw new Error(error.message)
  if (count === null) throw new Error('No se pudo obtener el conteo')
  return count
}

export async function validateHunt(client: AdminClient, huntId?: string) {
  if (huntId === undefined) return
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(huntId)) throw new Error('Edición inválida')
  const { data, error } = await client.from('treasure_hunts').select('id').eq('id', huntId).maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) throw new Error('No se encontró la edición seleccionada')
}

export async function participantIds(client: AdminClient, huntId?: string) {
  const rows = await readAllRows<{ user_id: string }>((from, to) => {
    let query = client.from('treasure_hunt_2025_scans').select('user_id').order('id').range(from, to)
    if (huntId) query = query.eq('hunt_id', huntId)
    return query
  })
  return [...new Set(rows.map(row => row.user_id))]
}

export function idBatches(ids: string[] | undefined): (string[] | undefined)[] {
  if (ids === undefined) return [undefined]
  return Array.from({ length: Math.ceil(ids.length / 200) }, (_, i) => ids.slice(i * 200, (i + 1) * 200))
}
