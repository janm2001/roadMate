export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      trip_members: {
        Row: {
          created_at: string;
          role: string;
          trip_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          role: string;
          trip_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          role?: string;
          trip_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_members_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_route_estimates: {
        Row: {
          distance_metres: number;
          duration_seconds: number;
          encoded_polyline: string | null;
          expires_at: string;
          fuel_consumption_microlitres: number | null;
          fuel_cost_cents: number | null;
          fuel_price_cents_per_litre: number | null;
          fuel_price_source_date: string | null;
          has_unpriced_tolls: boolean;
          major_roads: string[];
          provider_generated_at: string;
          toll_amounts: Json;
          trip_id: string;
          updated_at: string;
        };
        Insert: {
          distance_metres: number;
          duration_seconds: number;
          encoded_polyline?: string | null;
          expires_at?: string;
          fuel_consumption_microlitres?: number | null;
          fuel_cost_cents?: number | null;
          fuel_price_cents_per_litre?: number | null;
          fuel_price_source_date?: string | null;
          has_unpriced_tolls?: boolean;
          major_roads?: string[];
          provider_generated_at?: string;
          toll_amounts?: Json;
          trip_id: string;
          updated_at?: string;
        };
        Update: {
          distance_metres?: number;
          duration_seconds?: number;
          encoded_polyline?: string | null;
          expires_at?: string;
          fuel_consumption_microlitres?: number | null;
          fuel_cost_cents?: number | null;
          fuel_price_cents_per_litre?: number | null;
          fuel_price_source_date?: string | null;
          has_unpriced_tolls?: boolean;
          major_roads?: string[];
          provider_generated_at?: string;
          toll_amounts?: Json;
          trip_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_route_estimates_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: true;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_stops: {
        Row: {
          accommodation_budget_cents: number;
          country_code: string;
          created_at: string;
          google_place_id: string;
          id: string;
          nights: number;
          parking_budget_cents: number;
          place_label: string;
          position: number;
          selected_parking_place_id: string | null;
          trip_id: string;
          updated_at: string;
        };
        Insert: {
          accommodation_budget_cents?: number;
          country_code: string;
          created_at?: string;
          google_place_id: string;
          id?: string;
          nights?: number;
          parking_budget_cents?: number;
          place_label: string;
          position: number;
          selected_parking_place_id?: string | null;
          trip_id: string;
          updated_at?: string;
        };
        Update: {
          accommodation_budget_cents?: number;
          country_code?: string;
          created_at?: string;
          google_place_id?: string;
          id?: string;
          nights?: number;
          parking_budget_cents?: number;
          place_label?: string;
          position?: number;
          selected_parking_place_id?: string | null;
          trip_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_stops_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
      trips: {
        Row: {
          activities_budget_cents: number;
          created_at: string;
          end_date: string;
          estimate_status: string;
          food_budget_cents: number;
          fuel_price_override_cents_per_litre: number | null;
          fuel_type: string;
          id: string;
          owner_id: string;
          start_date: string;
          title: string;
          traveller_count: number;
          updated_at: string;
        };
        Insert: {
          activities_budget_cents?: number;
          created_at?: string;
          end_date: string;
          estimate_status?: string;
          food_budget_cents?: number;
          fuel_price_override_cents_per_litre?: number | null;
          fuel_type: string;
          id?: string;
          owner_id: string;
          start_date: string;
          title: string;
          traveller_count: number;
          updated_at?: string;
        };
        Update: {
          activities_budget_cents?: number;
          created_at?: string;
          end_date?: string;
          estimate_status?: string;
          food_budget_cents?: number;
          fuel_price_override_cents_per_litre?: number | null;
          fuel_type?: string;
          id?: string;
          owner_id?: string;
          start_date?: string;
          title?: string;
          traveller_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_trip_with_stops: {
        Args: {
          p_activities_budget_cents: number;
          p_end_date: string;
          p_food_budget_cents: number;
          p_fuel_price_override_cents_per_litre?: number;
          p_fuel_type: string;
          p_start_date: string;
          p_stops: Json;
          p_title: string;
          p_traveller_count: number;
        };
        Returns: string;
      };
      is_trip_member: { Args: { target_trip_id: string }; Returns: boolean };
      is_trip_owner: { Args: { target_trip_id: string }; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
