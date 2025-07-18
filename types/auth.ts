// Authentication Types for BetterAuth
// Created for ULTRATHINK Plan - Fase 1

import type { User as DatabaseUser } from './database'

// BetterAuth Session Type
export interface AuthSession {
  user: {
    id: string
    email: string
    name: string
    image?: string | null
    emailVerified: boolean
    createdAt: Date
    updatedAt: Date
  }
  session: {
    id: string
    userId: string
    token: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    ipAddress?: string | null
    userAgent?: string | null
  }
}

// Extended User Type with auth info
export interface AuthUser extends Omit<DatabaseUser, 'id'> {
  id: string
  emailVerified: boolean
  image?: string | null
}

// Magic Link Request Type
export interface MagicLinkRequest {
  email: string
  callbackUrl?: string
}

// Auth State Type
export interface AuthState {
  user: AuthUser | null
  session: AuthSession['session'] | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Login/Register Form Types
export interface LoginFormData {
  email: string
}

export interface RegisterFormData {
  email: string
  full_name: string
}

// Auth Context Type
export interface AuthContextType {
  user: AuthUser | null
  session: AuthSession['session'] | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (data: LoginFormData) => Promise<void>
  signOut: () => Promise<void>
  sendMagicLink: (data: MagicLinkRequest) => Promise<void>
}

// Auth Provider Props
export interface AuthProviderProps {
  children: React.ReactNode
}

// Magic Link Status
export type MagicLinkStatus = 
  | 'idle'
  | 'sending'
  | 'sent' 
  | 'error'
  | 'verifying'
  | 'success'

// Auth Error Types
export interface AuthError {
  code: string
  message: string
  details?: any
}

// Common Auth Error Codes
export const AUTH_ERROR_CODES = {
  INVALID_EMAIL: 'invalid_email',
  EMAIL_NOT_VERIFIED: 'email_not_verified',
  USER_NOT_FOUND: 'user_not_found',
  INVALID_TOKEN: 'invalid_token',
  TOKEN_EXPIRED: 'token_expired',
  SESSION_EXPIRED: 'session_expired',
  NETWORK_ERROR: 'network_error',
  UNKNOWN_ERROR: 'unknown_error',
} as const

export type AuthErrorCode = typeof AUTH_ERROR_CODES[keyof typeof AUTH_ERROR_CODES]

// Auth Action Types (for forms)
export type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_SESSION'; payload: AuthSession['session'] | null }
  | { type: 'SET_ERROR'; payload: AuthError | null }
  | { type: 'RESET' }

// Route Protection Types
export interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  adminOnly?: boolean
}

// Admin User Check
export interface AdminConfig {
  adminEmails: string[]
  superAdminEmails?: string[]
}

export const isAdminUser = (email: string, config: AdminConfig): boolean => {
  return config.adminEmails.includes(email) || 
         (config.superAdminEmails?.includes(email) ?? false)
}

// User Role Types
export type UserRole = 'user' | 'admin' | 'super_admin'

export interface UserWithRole extends AuthUser {
  role: UserRole
}

// Session Storage Keys
export const AUTH_STORAGE_KEYS = {
  SESSION_TOKEN: 'auth_session_token',
  USER_DATA: 'auth_user_data',
  REMEMBER_EMAIL: 'auth_remember_email',
} as const

// Auth Event Types (for analytics/tracking)
export type AuthEventType = 
  | 'sign_in_attempted'
  | 'sign_in_success'
  | 'sign_in_failed'
  | 'sign_out'
  | 'magic_link_sent'
  | 'magic_link_clicked'
  | 'session_expired'
  | 'user_created'

export interface AuthEvent {
  type: AuthEventType
  userId?: string
  email?: string
  timestamp: Date
  metadata?: Record<string, any>
}

// Auth Config Type
export interface AuthConfig {
  baseURL: string
  sessionDuration: number
  magicLinkExpiration: number
  enableRememberEmail: boolean
  enableAnalytics: boolean
  redirects: {
    signIn: string
    signOut: string
    afterSignIn: string
    afterSignOut: string
  }
}

// Default Auth Config
export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 
    (typeof window !== "undefined" ? window.location.origin : 'http://localhost:3000'),
  sessionDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
  magicLinkExpiration: 10 * 60 * 1000, // 10 minutes
  enableRememberEmail: true,
  enableAnalytics: false,
  redirects: {
    signIn: '/login',
    signOut: '/login',
    afterSignIn: '/dashboard',
    afterSignOut: '/',
  },
}