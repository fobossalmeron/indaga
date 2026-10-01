// Client-safe compatibility wrappers; database access lives in guarded server actions.
import * as treasureActions from './admin-treasure-actions'
import * as statsActions from './admin-stats-actions'
import * as userActions from './admin-user-actions'
import type { UserWithProgress } from '../../types/database'

export const adminUserActions = {
  getAllUsers: userActions.getAllUsers,
  getUserSummary: userActions.getUserSummary,
  getUserById: userActions.getUserById,
  updateUser: userActions.updateUser,
  deleteUser: userActions.deleteUser,
}

export const adminTreasureActions = {
  getAllTreasureHunts: treasureActions.getAllTreasureHunts,
  getTreasureHuntById: treasureActions.getTreasureHuntById,
  createTreasureHunt: treasureActions.createTreasureHunt,
  updateTreasureHunt: treasureActions.updateTreasureHunt,
  addTreasure: treasureActions.addTreasure,
  updateTreasure: treasureActions.updateTreasure,
  deleteTreasure: treasureActions.deleteTreasure,
}

export const adminStatsActions = {
  getDashboardStats: statsActions.getDashboardStats,
  getTreasureHuntStats: statsActions.getTreasureHuntStats,
  getUserActivityStats: statsActions.getUserActivityStats,
  getTreasureScanStats: statsActions.getTreasureScanStats,
}

// Utility functions for admin
export const adminUtils = {
  // Check if user is admin by email
  async isAdmin(email: string): Promise<boolean> {
    try {
      const adminEmails = (process.env.ADMIN_EMAILS || 'fobos.salmeron@gmail.com').split(',').map(value => value.trim().toLowerCase())
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