// Treasure Hunt Types and Interfaces
// Created for ULTRATHINK Plan - Fase 1

import type { 
  TreasureHunt, 
  TreasureHunt2025Treasure, 
  TreasureHunt2025Scan, 
  TreasureHunt2025Progress,
  User
} from './database'

// Enhanced Treasure Hunt Types

export interface TreasureHuntWithDetails extends TreasureHunt {
  treasures: TreasureHunt2025Treasure[]
  totalParticipants: number
  totalScans: number
  averageCompletion: number
}

export interface TreasureWithScanInfo extends TreasureHunt2025Treasure {
  isScanned: boolean
  scannedAt?: string
  scanCount?: number
}

export interface UserTreasureProgress extends TreasureHunt2025Progress {
  hunt: TreasureHunt
  scannedTreasures: TreasureScanWithDetails[]
  unscannedTreasures: TreasureHunt2025Treasure[]
  nextTreasures: TreasureHunt2025Treasure[]
}

export interface TreasureScanWithDetails extends TreasureHunt2025Scan {
  treasure: TreasureHunt2025Treasure
  user: Pick<User, 'id' | 'full_name' | 'email'>
}

// QR Code Types
export interface QRCodeData {
  treasureCode: string
  huntId: string
  timestamp: number
  version: number
}

export interface QRScanResult {
  success: boolean
  data?: QRCodeData
  treasure?: TreasureHunt2025Treasure
  error?: string
  alreadyScanned?: boolean
}

// Scanner Types
export type ScannerStatus = 
  | 'idle'
  | 'scanning'
  | 'processing'
  | 'success'
  | 'error'
  | 'already_scanned'

export interface ScannerState {
  status: ScannerStatus
  isOpen: boolean
  result?: QRScanResult
  error?: string
}

// Progress Types
export interface ProgressStats {
  treasuresFound: number
  totalTreasures: number
  completionPercentage: number
  rank?: number
  totalParticipants?: number
  averageCompletion?: number
}

export interface ProgressMilestone {
  percentage: number
  title: string
  description: string
  reward?: string
  unlocked: boolean
}

// Leaderboard Types
export interface LeaderboardEntry {
  userId: string
  fullName: string
  treasuresFound: number
  completionPercentage: number
  completedAt?: string
  rank: number
  avatar?: string
}

export interface LeaderboardData {
  topUsers: LeaderboardEntry[]
  currentUserRank?: number
  totalParticipants: number
  lastUpdated: string
}

// Achievement Types
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  requirement: number | string
  unlocked: boolean
  unlockedAt?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// Map Types
export interface TreasureLocation {
  treasureId: string
  treasureName: string
  coordinates?: {
    lat: number
    lng: number
  }
  isScanned: boolean
  isNearby?: boolean
  distance?: number
}

export interface TreasureMapData {
  center: {
    lat: number
    lng: number
  }
  zoom: number
  treasures: TreasureLocation[]
  userLocation?: {
    lat: number
    lng: number
  }
}

// Admin Types
export interface TreasureHuntStats {
  totalUsers: number
  totalScans: number
  totalTreasures: number
  averageCompletion: number
  completionDistribution: {
    '0-25%': number
    '26-50%': number
    '51-75%': number
    '76-99%': number
    '100%': number
  }
  dailyScans: Array<{
    date: string
    scans: number
  }>
  popularTreasures: Array<{
    treasureId: string
    treasureName: string
    scanCount: number
  }>
}

export interface AdminUserDetails extends User {
  progress?: TreasureHunt2025Progress
  scans: TreasureScanWithDetails[]
  totalScans: number
  completionPercentage: number
  rank?: number
}

// Event Types for real-time updates
export type TreasureHuntEventType = 
  | 'treasure_scanned'
  | 'progress_updated'
  | 'leaderboard_updated'
  | 'achievement_unlocked'
  | 'hunt_completed'

export interface TreasureHuntEvent {
  type: TreasureHuntEventType
  userId: string
  huntId: string
  data: any
  timestamp: Date
}

// Form Types
export interface ScanSubmissionData {
  treasureCode: string
  userId: string
  huntId: string
  timestamp: Date
  location?: {
    lat: number
    lng: number
  }
}

// Filter and Sort Types
export type TreasureFilter = 
  | 'all'
  | 'scanned'
  | 'unscanned'
  | 'nearby'

export type TreasureSort = 
  | 'name'
  | 'distance'
  | 'scanned_date'
  | 'popularity'

export type LeaderboardFilter = 
  | 'all'
  | 'completed'
  | 'in_progress'
  | 'friends'

export type LeaderboardSort = 
  | 'completion_percentage'
  | 'treasures_found'
  | 'completion_time'

// UI State Types
export interface TreasureHuntUIState {
  activeTab: 'map' | 'list' | 'progress' | 'leaderboard'
  selectedTreasure?: string
  filter: TreasureFilter
  sort: TreasureSort
  showCompleted: boolean
  isLoading: boolean
}

// Constants
export const TREASURE_HUNT_CONSTANTS = {
  MAX_DISTANCE_FOR_NEARBY: 1000, // meters
  SCAN_COOLDOWN_TIME: 5000, // milliseconds
  LEADERBOARD_UPDATE_INTERVAL: 30000, // milliseconds
  PROGRESS_ANIMATION_DURATION: 1000, // milliseconds
  QR_CODE_VERSION: 1,
} as const

// Error Types
export interface TreasureHuntError {
  code: 'INVALID_QR' | 'ALREADY_SCANNED' | 'HUNT_EXPIRED' | 'NETWORK_ERROR' | 'UNKNOWN'
  message: string
  treasureCode?: string
  details?: any
}

// Utility Types
export type TreasureHuntActionResult<T = any> = {
  success: boolean
  data?: T
  error?: TreasureHuntError
}

// Hook Types
export interface UseTreasureHuntReturn {
  progress: UserTreasureProgress | null
  treasures: TreasureWithScanInfo[]
  stats: ProgressStats | null
  achievements: Achievement[]
  isLoading: boolean
  error: string | null
  scanTreasure: (treasureCode: string) => Promise<TreasureHuntActionResult>
  refreshProgress: () => Promise<void>
}

export interface UseQRScannerReturn {
  isOpen: boolean
  status: ScannerStatus
  result: QRScanResult | null
  error: string | null
  openScanner: () => void
  closeScanner: () => void
  resetScanner: () => void
}

// Configuration Types
export interface TreasureHuntConfig {
  huntId: string
  year: number
  enableGeolocation: boolean
  enableNotifications: boolean
  enableLeaderboard: boolean
  enableAchievements: boolean
  scanCooldownTime: number
  nearbyDistance: number
}

export const DEFAULT_TREASURE_HUNT_CONFIG: TreasureHuntConfig = {
  huntId: '',
  year: 2025,
  enableGeolocation: true,
  enableNotifications: true,
  enableLeaderboard: true,
  enableAchievements: true,
  scanCooldownTime: TREASURE_HUNT_CONSTANTS.SCAN_COOLDOWN_TIME,
  nearbyDistance: TREASURE_HUNT_CONSTANTS.MAX_DISTANCE_FOR_NEARBY,
}