export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      equipment: {
        Row: {
          id: number
          category_id: number
          type: string
          model: string
          description: string | null
          image_url: string | null
          daily_rate: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          category_id: number
          type: string
          model: string
          description?: string | null
          image_url?: string | null
          daily_rate: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          category_id?: number
          type?: string
          model?: string
          description?: string | null
          image_url?: string | null
          daily_rate?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: number
          user_id: string
          equipment_id: number
          start_date: string
          end_date: string
          status: string
          total_price: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          equipment_id: number
          start_date: string
          end_date: string
          status?: string
          total_price: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          equipment_id?: number
          start_date?: string
          end_date?: string
          status?: string
          total_price?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: string
          created_at?: string
        }
      }
    }
  }
}

export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Equipment = Database["public"]["Tables"]["equipment"]["Row"]
export type Booking = Database["public"]["Tables"]["bookings"]["Row"]
export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"]
