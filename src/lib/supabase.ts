// Supabase Client Configuration
// Created for ULTRATHINK Plan - Fase 1

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/database'

// Environment variables validation
const supabaseUrl =
  process.env.VERCELDB__NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey =
  process.env.VERCELDB__NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined')
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client (for admin operations)
export const createServerSupabaseClient = () => {
  const serviceRoleKey =
    process.env.VERCELDB__SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')
  }

  // The createClient function is overloaded to accept the service role key.
  // We need to cast it to any to avoid a type error.
  return createClient<Database>(supabaseUrl, serviceRoleKey as any)
}

// Type-safe helper functions for common operations

// User Operations
export const userOperations = {
  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    return { data, error }
  },

  async createUser(userData: {
    email: string
    full_name: string
    provider?: string
    avatar_url?: string
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    return { data, error }
  },

  async updateUser(userId: string, updates: {
    full_name?: string
    email_verified?: boolean
    avatar_url?: string
  }) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  }
}

// Saved Events Operations
export const savedEventsOperations = {
  async getUserSavedEvents(userId: string) {
    const { data, error } = await supabase
      .from('saved_events')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })

    return { data, error }
  },

  async saveEvent(eventData: {
    user_id: string
    event_id: string
    event_title: string
    event_date?: string
  }) {
    const { data, error } = await supabase
      .from('saved_events')
      .insert(eventData)
      .select()
      .single()

    return { data, error }
  },

  async unsaveEvent(userId: string, eventId: string) {
    const { error } = await supabase
      .from('saved_events')
      .delete()
      .eq('user_id', userId)
      .eq('event_id', eventId)

    return { error }
  }
}

// Saved Places Operations
export const savedPlacesOperations = {
  async getUserSavedPlaces(userId: string) {
    const { data, error } = await supabase
      .from('saved_places')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })

    return { data, error }
  },

  async savePlace(placeData: {
    user_id: string
    place_id: string
    place_name: string
    place_category?: string
  }) {
    const { data, error } = await supabase
      .from('saved_places')
      .insert(placeData)
      .select()
      .single()

    return { data, error }
  },

  async unsavePlace(userId: string, placeId: string) {
    const { error } = await supabase
      .from('saved_places')
      .delete()
      .eq('user_id', userId)
      .eq('place_id', placeId)

    return { error }
  }
}

// Treasure Hunt Operations
export const treasureHuntOperations = {
  async getActiveTreasureHunt() {
    const { data, error } = await supabase
      .from('treasure_hunts')
      .select('*')
      .eq('is_active', true)
      .single()

    return { data, error }
  },

  async getTreasureHuntTreasures(huntId: string) {
    const { data, error } = await supabase
      .from('treasure_hunt_2025_treasures')
      .select('*')
      .eq('hunt_id', huntId)
      .order('treasure_name')

    return { data, error }
  },

  async getUserTreasureProgress(userId: string, huntId: string) {
    const { data, error } = await supabase
      .from('treasure_hunt_2025_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('hunt_id', huntId)
      .single()

    return { data, error }
  },

  async getUserTreasureScans(userId: string, huntId: string) {
    const { data, error } = await supabase
      .from('treasure_hunt_2025_scans')
      .select(`
        *,
        treasure_hunt_2025_treasures (
          treasure_name,
          treasure_description,
          treasure_code
        )
      `)
      .eq('user_id', userId)
      .eq('hunt_id', huntId)
      .order('scanned_at', { ascending: false })

    return { data, error }
  },

  async scanTreasure(scanData: {
    user_id: string
    hunt_id: string
    treasure_id: string
  }) {
    const { data, error } = await supabase
      .from('treasure_hunt_2025_scans')
      .insert(scanData)
      .select()
      .single()

    return { data, error }
  },

  async getTreasureByCode(treasureCode: string) {
    const { data, error } = await supabase
      .from('treasure_hunt_2025_treasures')
      .select('*')
      .eq('treasure_code', treasureCode)
      .single()

    return { data, error }
  }
}

// Admin Operations (only accessible with service role key)
export const adminOperations = {
  async getAllUsers() {
    const serverClient = createServerSupabaseClient()
    const { data, error } = await serverClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async getTreasureHuntStats(huntId: string) {
    const serverClient = createServerSupabaseClient()

    // Get total users with progress
    const { data: progressData, error: progressError } = await serverClient
      .from('treasure_hunt_2025_progress')
      .select('*')
      .eq('hunt_id', huntId)

    // Get total scans
    const { count: totalScans, error: scansError } = await serverClient
      .from('treasure_hunt_2025_scans')
      .select('*', { count: 'exact' })
      .eq('hunt_id', huntId)

    return {
      data: {
        totalUsers: progressData?.length || 0,
        totalScans: totalScans || 0,
        progressData
      },
      error: progressError || scansError
    }
  }
}

export default supabase