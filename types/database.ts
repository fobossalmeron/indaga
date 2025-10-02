export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          email_verified: boolean | null
          full_name: string
          id: string
          provider: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          full_name: string
          id?: string
          provider?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string
          id?: string
          provider?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_events: {
        Row: {
          event_date: string | null
          event_id: string
          event_title: string
          id: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          event_date?: string | null
          event_id: string
          event_title: string
          id?: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          event_date?: string | null
          event_id?: string
          event_title?: string
          id?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_places: {
        Row: {
          id: string
          place_category: string | null
          place_id: string
          place_name: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          place_category?: string | null
          place_id: string
          place_name: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          place_category?: string | null
          place_id?: string
          place_name?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_places_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      treasure_hunts: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          start_date: string | null
          total_treasures: number | null
          year: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          start_date?: string | null
          total_treasures?: number | null
          year: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string | null
          total_treasures?: number | null
          year?: number
        }
        Relationships: []
      }
      treasure_hunt_2025_treasures: {
        Row: {
          created_at: string | null
          hunt_id: string
          id: string
          location_coordinates: unknown | null
          treasure_code: string
          treasure_secret: string
          treasure_location_maps_url: string | null
          treasure_name: string
          treasure_website: string | null
          treasure_category: string | null
        }
        Insert: {
          created_at?: string | null
          hunt_id: string
          id?: string
          location_coordinates?: unknown | null
          treasure_code: string
          treasure_secret: string
          treasure_location_maps_url?: string | null
          treasure_name: string
          treasure_website?: string | null
          treasure_category?: string | null
        }
        Update: {
          created_at?: string | null
          hunt_id?: string
          id?: string
          location_coordinates?: unknown | null
          treasure_code?: string
          treasure_secret: string
          treasure_location_maps_url?: string | null
          treasure_name?: string
          treasure_website?: string | null
          treasure_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treasure_hunt_2025_treasures_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "treasure_hunts"
            referencedColumns: ["id"]
          },
        ]
      }
      treasure_hunt_2025_scans: {
        Row: {
          hunt_id: string
          id: string
          scanned_at: string | null
          treasure_id: string
          user_id: string
        }
        Insert: {
          hunt_id: string
          id?: string
          scanned_at?: string | null
          treasure_id: string
          user_id: string
        }
        Update: {
          hunt_id?: string
          id?: string
          scanned_at?: string | null
          treasure_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treasure_hunt_2025_scans_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "treasure_hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treasure_hunt_2025_scans_treasure_id_fkey"
            columns: ["treasure_id"]
            isOneToOne: false
            referencedRelation: "treasure_hunt_2025_treasures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treasure_hunt_2025_scans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      treasure_hunt_2025_progress: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          hunt_id: string
          id: string
          started_at: string | null
          treasures_found: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          hunt_id: string
          id?: string
          started_at?: string | null
          treasures_found?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          hunt_id?: string
          id?: string
          started_at?: string | null
          treasures_found?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treasure_hunt_2025_progress_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "treasure_hunts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treasure_hunt_2025_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types for easier usage
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  email_verified: boolean | null
  provider: string | null
  created_at: string | null
  updated_at: string | null
  role?: string | null
}

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type SavedEvent = Database['public']['Tables']['saved_events']['Row']
export type SavedEventInsert = Database['public']['Tables']['saved_events']['Insert']
export type SavedEventUpdate = Database['public']['Tables']['saved_events']['Update']

export type SavedPlace = Database['public']['Tables']['saved_places']['Row']
export type SavedPlaceInsert = Database['public']['Tables']['saved_places']['Insert']
export type SavedPlaceUpdate = Database['public']['Tables']['saved_places']['Update']

export type TreasureHunt = Database['public']['Tables']['treasure_hunts']['Row']
export type TreasureHuntInsert = Database['public']['Tables']['treasure_hunts']['Insert']
export type TreasureHuntUpdate = Database['public']['Tables']['treasure_hunts']['Update']

export type TreasureHunt2025Treasure = Database['public']['Tables']['treasure_hunt_2025_treasures']['Row']
export type TreasureHunt2025TreasureInsert = Database['public']['Tables']['treasure_hunt_2025_treasures']['Insert']
export type TreasureHunt2025TreasureUpdate = Database['public']['Tables']['treasure_hunt_2025_treasures']['Update']

export type TreasureHunt2025Scan = Database['public']['Tables']['treasure_hunt_2025_scans']['Row']
export type TreasureHunt2025ScanInsert = Database['public']['Tables']['treasure_hunt_2025_scans']['Insert']
export type TreasureHunt2025ScanUpdate = Database['public']['Tables']['treasure_hunt_2025_scans']['Update']

export type TreasureHunt2025Progress = Database['public']['Tables']['treasure_hunt_2025_progress']['Row']
export type TreasureHunt2025ProgressInsert = Database['public']['Tables']['treasure_hunt_2025_progress']['Insert']
export type TreasureHunt2025ProgressUpdate = Database['public']['Tables']['treasure_hunt_2025_progress']['Update']

// Extended types with relationships
export type TreasureScanWithTreasure = TreasureHunt2025Scan & {
  treasure_hunt_2025_treasures: TreasureHunt2025Treasure
}

export interface UserWithProgress extends User {
  treasure_hunt_2025_progress?: TreasureHunt2025Progress[]
}

export type TreasureHuntWithStats = TreasureHunt & {
  total_participants?: number
  total_scans?: number
  completion_rate?: number
}