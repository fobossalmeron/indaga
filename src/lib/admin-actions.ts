// Admin Actions for INDAGA Panel
// Created for ULTRATHINK Plan - Agent C

import { supabase } from './supabase'
import type {
  User,
  TreasureHunt,
  TreasureHunt2025Treasure,
  TreasureHunt2025TreasureUpdate,
  TreasureHunt2025Scan,
  TreasureHunt2025Progress,
  UserWithProgress,
  TreasureHuntWithStats
} from '../../types/database'

// User Management Actions
export const adminUserActions = {
  // Get all users with pagination and filters
  async getAllUsers(options: {
    page?: number
    limit?: number
    search?: string
    verified?: boolean
    sortBy?: 'created_at' | 'email' | 'full_name'
    sortOrder?: 'asc' | 'desc'
  } = {}) {
    const { page = 1, limit = 10, search, verified, sortBy = 'created_at', sortOrder = 'desc' } = options

    let query = supabase
      .from('users')
      .select(`
        *
      `)

    // Apply filters
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (typeof verified === 'boolean') {
      query = query.eq('email_verified', verified)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Error fetching users: ${error.message}`)
    }

    return {
      users: data as UserWithProgress[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    }
  },

  // Get user details by ID
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        saved_events(*),
        saved_places(*),
        treasure_hunt_2025_progress(*),
        treasure_hunt_2025_scans(
          *,
          treasure_hunt_2025_treasures(*)
        )
      `)
      .eq('id', userId)
      .single()

    if (error) {
      throw new Error(`Error fetching user: ${error.message}`)
    }

    return data
  },

  // Update user
  async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Error updating user: ${error.message}`)
    }

    return data
  },

  // Delete user (soft delete by setting email_verified to false)
  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('users')
      .update({ email_verified: false })
      .eq('id', userId)

    if (error) {
      throw new Error(`Error deleting user: ${error.message}`)
    }

    return true
  }
}

// Treasure Hunt Management Actions
export const adminTreasureActions = {
  // Get all treasure hunts with stats
  async getAllTreasureHunts() {
    const { data, error } = await supabase
      .from('treasure_hunts')
      .select(`
        *,
        treasure_hunt_2025_treasures(count),
        treasure_hunt_2025_scans(count),
        treasure_hunt_2025_progress(count)
      `)
      .order('year', { ascending: false })

    if (error) {
      throw new Error(`Error fetching treasure hunts: ${error.message}`)
    }

    return data as TreasureHuntWithStats[]
  },

  // Get treasure hunt details
  async getTreasureHuntById(huntId: string) {
    const { data, error } = await supabase
      .from('treasure_hunts')
      .select(`
        *,
        treasure_hunt_2025_treasures(*),
        treasure_hunt_2025_scans(
          *,
          users(full_name, email),
          treasure_hunt_2025_treasures(treasure_name)
        ),
        treasure_hunt_2025_progress(
          *,
          users(full_name, email)
        )
      `)
      .eq('id', huntId)
      .single()

    if (error) {
      throw new Error(`Error fetching treasure hunt: ${error.message}`)
    }

    return data
  },

  // Create new treasure hunt
  async createTreasureHunt(huntData: {
    name: string
    year: number
    description?: string
    start_date?: string
    end_date?: string
    total_treasures?: number
  }) {
    const { data, error } = await supabase
      .from('treasure_hunts')
      .insert(huntData)
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating treasure hunt: ${error.message}`)
    }

    return data
  },

  // Update treasure hunt
  async updateTreasureHunt(huntId: string, updates: Partial<TreasureHunt>) {
    const { data, error } = await supabase
      .from('treasure_hunts')
      .update(updates)
      .eq('id', huntId)
      .select()
      .single()

    if (error) {
      throw new Error(`Error updating treasure hunt: ${error.message}`)
    }

    return data
  },

  // Add treasure to hunt
  async addTreasure(treasureData: {
    hunt_id: string
    treasure_code: string
    treasure_name: string
    treasure_secret: string
    treasure_location_maps_url?: string
  }) {
    const { data, error } = await supabase
      .from('treasure_hunt_2025_treasures')
      .insert(treasureData)
      .select()
      .single()

    if (error) {
      throw new Error(`Error adding treasure: ${error.message}`)
    }

    return data
  },

  // Update treasure
  async updateTreasure(treasureId: string, updates: TreasureHunt2025TreasureUpdate) {
    const { data, error } = await supabase
      .from('treasure_hunt_2025_treasures')
      .update(updates)
      .eq('id', treasureId)
      .select()
      .single()

    if (error) {
      throw new Error(`Error updating treasure: ${error.message}`)
    }

    return data
  },

  // Delete treasure
  async deleteTreasure(treasureId: string) {
    const { error } = await supabase
      .from('treasure_hunt_2025_treasures')
      .delete()
      .eq('id', treasureId)

    if (error) {
      throw new Error(`Error deleting treasure: ${error.message}`)
    }

    return true
  }
}

// Analytics and Statistics Actions
export const adminStatsActions = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      // Get total users
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      if (usersError) throw usersError

      // Get verified users
      const { count: verifiedUsers, error: verifiedError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('email_verified', true)

      if (verifiedError) throw verifiedError

      // Get total scans
      const { count: totalScans, error: scansError } = await supabase
        .from('treasure_hunt_2025_scans')
        .select('*', { count: 'exact', head: true })

      if (scansError) throw scansError

      // Get active treasure hunts
      const { count: activeTreasureHunts, error: huntsError } = await supabase
        .from('treasure_hunts')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      if (huntsError) throw huntsError

      // Get total saved events
      const { count: totalSavedEvents, error: eventsError } = await supabase
        .from('saved_events')
        .select('*', { count: 'exact', head: true })

      if (eventsError) throw eventsError

      // Get total saved places
      const { count: totalSavedPlaces, error: placesError } = await supabase
        .from('saved_places')
        .select('*', { count: 'exact', head: true })

      if (placesError) throw placesError

      // Get recent users (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { count: recentUsers, error: recentError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())

      if (recentError) throw recentError

      return {
        totalUsers: totalUsers || 0,
        verifiedUsers: verifiedUsers || 0,
        totalScans: totalScans || 0,
        activeTreasureHunts: activeTreasureHunts || 0,
        totalSavedEvents: totalSavedEvents || 0,
        totalSavedPlaces: totalSavedPlaces || 0,
        recentUsers: recentUsers || 0,
        verificationRate: totalUsers ? Math.round((verifiedUsers || 0) / totalUsers * 100) : 0
      }
    } catch (error) {
      throw new Error(`Error fetching dashboard stats: ${error}`)
    }
  },

  // Get treasure hunt participation stats
  async getTreasureHuntStats(huntId?: string) {
    let query = supabase
      .from('treasure_hunt_2025_progress')
      .select(`
        *,
        users(full_name, email),
        treasure_hunts(name, year)
      `)

    if (huntId) {
      query = query.eq('hunt_id', huntId)
    }

    const { data, error } = await query.order('completion_percentage', { ascending: false })

    if (error) {
      throw new Error(`Error fetching treasure hunt stats: ${error.message}`)
    }

    return data
  },

  // Get user activity over time
  async getUserActivityStats(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Error fetching user activity: ${error.message}`)
    }

    // Group by day
    const dailyStats: { [key: string]: number } = {}

    data?.forEach(user => {
      const date = new Date(user.created_at || '').toISOString().split('T')[0]
      dailyStats[date] = (dailyStats[date] || 0) + 1
    })

    return Object.entries(dailyStats).map(([date, count]) => ({
      date,
      users: count
    }))
  },

  // Get treasure scan activity
  async getTreasureScanStats(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('treasure_hunt_2025_scans')
      .select(`
        scanned_at,
        treasure_hunt_2025_treasures(treasure_name)
      `)
      .gte('scanned_at', startDate.toISOString())
      .order('scanned_at', { ascending: true })

    if (error) {
      throw new Error(`Error fetching scan stats: ${error.message}`)
    }

    // Group by day
    const dailyStats: { [key: string]: number } = {}

    data?.forEach(scan => {
      const date = new Date(scan.scanned_at || '').toISOString().split('T')[0]
      dailyStats[date] = (dailyStats[date] || 0) + 1
    })

    return Object.entries(dailyStats).map(([date, count]) => ({
      date,
      scans: count
    }))
  }
}

// Utility functions for admin
export const adminUtils = {
  // Check if user is admin by email
  async isAdmin(email: string): Promise<boolean> {
    try {
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['fobos.salmeron@gmail.com']
      return adminEmails.includes(email.toLowerCase())
    } catch (error) {
      console.error('Error in isAdmin check:', error)
      return false
    }
  },

  // Format user data for export
  formatUsersForExport(users: UserWithProgress[]) {
    return users.map(user => ({
      'ID': user.id,
      'Email': user.email,
      'Nombre': user.full_name,
      'Verificado': user.email_verified ? 'Sí' : 'No',
      'Proveedor': user.provider || 'N/A',
      'Fecha de Registro': new Date(user.created_at || '').toLocaleDateString(),
      'Eventos Guardados': (user as any).saved_events?.length || 0,
      'Lugares Guardados': (user as any).saved_places?.length || 0,
      'Tesoros Encontrados': user.treasure_hunt_2025_progress?.[0]?.treasures_found || 0,
      'Progreso Treasure Hunt': user.treasure_hunt_2025_progress?.[0]?.completion_percentage || 0
    }))
  },

  // Generate treasure hunt report
  formatTreasureHuntReport(huntData: any) {
    return {
      hunt: {
        name: huntData.name,
        year: huntData.year,
        description: huntData.description,
        total_treasures: huntData.total_treasures,
        is_active: huntData.is_active
      },
      stats: {
        total_participants: huntData.treasure_hunt_2025_progress?.length || 0,
        total_scans: huntData.treasure_hunt_2025_scans?.length || 0,
        completion_rate: huntData.treasure_hunt_2025_progress?.filter((p: any) => p.completed_at).length || 0
      },
      treasures: huntData.treasure_hunt_2025_treasures?.map((t: any) => ({
        name: t.treasure_name,
        code: t.treasure_code,
        secret: t.treasure_secret,
        maps_url: t.treasure_location_maps_url,
        scan_count: huntData.treasure_hunt_2025_scans?.filter((s: any) => s.treasure_id === t.id).length || 0
      })) || []
    }
  }
}