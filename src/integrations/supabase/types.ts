export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          notification_preference: Database["public"]["Enums"]["notification_preference"]
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notification_preference?: Database["public"]["Enums"]["notification_preference"]
          phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notification_preference?: Database["public"]["Enums"]["notification_preference"]
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_services: {
        Row: {
          created_at: string | null
          end_time: string | null
          event_id: string | null
          id: string
          price: number
          quantity: number | null
          service_id: string | null
          special_requests: string | null
          start_time: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          event_id?: string | null
          id?: string
          price: number
          quantity?: number | null
          service_id?: string | null
          special_requests?: string | null
          start_time?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          event_id?: string | null
          id?: string
          price?: number
          quantity?: number | null
          service_id?: string | null
          special_requests?: string | null
          start_time?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_services_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "provider_services"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          date: string
          description: string
          id: string
          location_id: string | null
          organizer_id: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description: string
          id?: string
          location_id?: string | null
          organizer_id: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          location_id?: string | null
          organizer_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string | null
          email: string
          event_id: string | null
          id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          email: string
          event_id?: string | null
          id?: string
          status?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          event_id?: string | null
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          amenities: string[] | null
          capacity: number
          description: string
          id: string
          images: string[] | null
          name: string
          price_per_hour: number
        }
        Insert: {
          address: string
          amenities?: string[] | null
          capacity: number
          description: string
          id?: string
          images?: string[] | null
          name: string
          price_per_hour: number
        }
        Update: {
          address?: string
          amenities?: string[] | null
          capacity?: number
          description?: string
          id?: string
          images?: string[] | null
          name?: string
          price_per_hour?: number
        }
        Relationships: []
      }
      menus: {
        Row: {
          description: string
          dietary_info: string[] | null
          event_id: string | null
          id: string
          items: Json | null
          name: string
          price_per_person: number
        }
        Insert: {
          description: string
          dietary_info?: string[] | null
          event_id?: string | null
          id?: string
          items?: Json | null
          name: string
          price_per_person: number
        }
        Update: {
          description?: string
          dietary_info?: string[] | null
          event_id?: string | null
          id?: string
          items?: Json | null
          name?: string
          price_per_person?: number
        }
        Relationships: [
          {
            foreignKeyName: "menus_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          event_id: string | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          role: string | null
          status: string | null
          subscription: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name?: string | null
          role?: string | null
          status?: string | null
          subscription?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          role?: string | null
          status?: string | null
          subscription?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          event_id: string | null
          id: string
          provider_id: string | null
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          provider_id?: string | null
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          provider_id?: string | null
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_services: {
        Row: {
          available: boolean | null
          base_price: number
          category_id: string | null
          created_at: string | null
          description: string | null
          dietary_options: string[] | null
          id: string
          images: string[] | null
          insurance_required: boolean | null
          languages: string[] | null
          lead_time: unknown | null
          maximum_capacity: number | null
          minimum_order: number | null
          name: string
          price_type: string | null
          provider_id: string | null
          rating: number | null
          review_count: number | null
          service_area: string[] | null
          setup_requirements: string | null
        }
        Insert: {
          available?: boolean | null
          base_price: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          dietary_options?: string[] | null
          id?: string
          images?: string[] | null
          insurance_required?: boolean | null
          languages?: string[] | null
          lead_time?: unknown | null
          maximum_capacity?: number | null
          minimum_order?: number | null
          name: string
          price_type?: string | null
          provider_id?: string | null
          rating?: number | null
          review_count?: number | null
          service_area?: string[] | null
          setup_requirements?: string | null
        }
        Update: {
          available?: boolean | null
          base_price?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          dietary_options?: string[] | null
          id?: string
          images?: string[] | null
          insurance_required?: boolean | null
          languages?: string[] | null
          lead_time?: unknown | null
          maximum_capacity?: number | null
          minimum_order?: number | null
          name?: string
          price_type?: string | null
          provider_id?: string | null
          rating?: number | null
          review_count?: number | null
          service_area?: string[] | null
          setup_requirements?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_availability: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_time: string | null
          id: string
          is_available: boolean | null
          service_id: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          is_available?: boolean | null
          service_id?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          is_available?: boolean | null
          service_id?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_availability_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "provider_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_details: {
        Row: {
          cancellation_policy: string | null
          category_specific_details: Json
          cleanup_time: unknown | null
          created_at: string | null
          dietary_options: string[] | null
          id: string
          min_notice_period: unknown | null
          payment_terms: string | null
          service_id: string | null
          setup_time: unknown | null
        }
        Insert: {
          cancellation_policy?: string | null
          category_specific_details?: Json
          cleanup_time?: unknown | null
          created_at?: string | null
          dietary_options?: string[] | null
          id?: string
          min_notice_period?: unknown | null
          payment_terms?: string | null
          service_id?: string | null
          setup_time?: unknown | null
        }
        Update: {
          cancellation_policy?: string | null
          category_specific_details?: Json
          cleanup_time?: unknown | null
          created_at?: string | null
          dietary_options?: string[] | null
          id?: string
          min_notice_period?: unknown | null
          payment_terms?: string | null
          service_id?: string | null
          setup_time?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "service_details_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "provider_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_equipment: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          included_in_price: boolean | null
          name: string
          quantity: number
          rental_price: number | null
          service_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          included_in_price?: boolean | null
          name: string
          quantity: number
          rental_price?: number | null
          service_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          included_in_price?: boolean | null
          name?: string
          quantity?: number
          rental_price?: number | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_equipment_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "provider_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_insurance: {
        Row: {
          coverage_amount: number
          created_at: string | null
          document_url: string | null
          expiration_date: string
          id: string
          insurance_type: string
          policy_number: string
          provider_id: string | null
          provider_name: string
        }
        Insert: {
          coverage_amount: number
          created_at?: string | null
          document_url?: string | null
          expiration_date: string
          id?: string
          insurance_type: string
          policy_number: string
          provider_id?: string | null
          provider_name: string
        }
        Update: {
          coverage_amount?: number
          created_at?: string | null
          document_url?: string | null
          expiration_date?: string
          id?: string
          insurance_type?: string
          policy_number?: string
          provider_id?: string | null
          provider_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_insurance_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_menus: {
        Row: {
          created_at: string | null
          description: string | null
          dietary_options: string[] | null
          id: string
          includes_equipment: boolean | null
          includes_service: boolean | null
          items: Json
          maximum_guests: number | null
          minimum_guests: number | null
          name: string
          price_per_person: number
          service_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dietary_options?: string[] | null
          id?: string
          includes_equipment?: boolean | null
          includes_service?: boolean | null
          items: Json
          maximum_guests?: number | null
          minimum_guests?: number | null
          name: string
          price_per_person: number
          service_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dietary_options?: string[] | null
          id?: string
          includes_equipment?: boolean | null
          includes_service?: boolean | null
          items?: Json
          maximum_guests?: number | null
          minimum_guests?: number | null
          name?: string
          price_per_person?: number
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_menus_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "provider_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_portfolio: {
        Row: {
          client_name: string | null
          created_at: string | null
          date: string | null
          description: string | null
          event_type: string | null
          id: string
          images: string[] | null
          provider_id: string | null
          testimonial: string | null
          title: string
        }
        Insert: {
          client_name?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          event_type?: string | null
          id?: string
          images?: string[] | null
          provider_id?: string | null
          testimonial?: string | null
          title: string
        }
        Update: {
          client_name?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          event_type?: string | null
          id?: string
          images?: string[] | null
          provider_id?: string | null
          testimonial?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_portfolio_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          logo_url: string | null
          name: string
          phone: string
          rating: number | null
          review_count: number | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          logo_url?: string | null
          name: string
          phone: string
          rating?: number | null
          review_count?: number | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string
          rating?: number | null
          review_count?: number | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string | null
          last_login: string | null
          tasks_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          last_login?: string | null
          tasks_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          last_login?: string | null
          tasks_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_service_availability: {
        Args: {
          p_service_id: string
          p_start_time: string
          p_end_time: string
        }
        Returns: boolean
      }
      promote_to_superadmin: {
        Args: {
          user_email: string
        }
        Returns: string
      }
    }
    Enums: {
      notification_preference: "email" | "sms" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
