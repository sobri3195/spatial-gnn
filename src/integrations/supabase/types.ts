export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analysis_results: {
        Row: {
          annotation_id: string | null
          avg_expression: number | null
          cell_count: number | null
          created_at: string | null
          gene_id: string | null
          heatmap_data: Json | null
          id: string
          max_expression: number | null
          min_expression: number | null
          session_id: string | null
        }
        Insert: {
          annotation_id?: string | null
          avg_expression?: number | null
          cell_count?: number | null
          created_at?: string | null
          gene_id?: string | null
          heatmap_data?: Json | null
          id?: string
          max_expression?: number | null
          min_expression?: number | null
          session_id?: string | null
        }
        Update: {
          annotation_id?: string | null
          avg_expression?: number | null
          cell_count?: number | null
          created_at?: string | null
          gene_id?: string | null
          heatmap_data?: Json | null
          id?: string
          max_expression?: number | null
          min_expression?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_annotation_id_fkey"
            columns: ["annotation_id"]
            isOneToOne: false
            referencedRelation: "annotations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_results_gene_id_fkey"
            columns: ["gene_id"]
            isOneToOne: false
            referencedRelation: "genes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "analysis_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          parameters: Json | null
          selected_genes: string[] | null
          session_name: string
          started_at: string | null
          status: Database["public"]["Enums"]["analysis_status"] | null
          wsi_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          parameters?: Json | null
          selected_genes?: string[] | null
          session_name: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["analysis_status"] | null
          wsi_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          parameters?: Json | null
          selected_genes?: string[] | null
          session_name?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["analysis_status"] | null
          wsi_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_sessions_wsi_id_fkey"
            columns: ["wsi_id"]
            isOneToOne: false
            referencedRelation: "wsi_images"
            referencedColumns: ["id"]
          },
        ]
      }
      annotations: {
        Row: {
          annotation_type: Database["public"]["Enums"]["annotation_type"] | null
          color: string | null
          coordinates: Json
          created_at: string | null
          description: string | null
          id: string
          name: string
          wsi_id: string | null
        }
        Insert: {
          annotation_type?:
            | Database["public"]["Enums"]["annotation_type"]
            | null
          color?: string | null
          coordinates: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          wsi_id?: string | null
        }
        Update: {
          annotation_type?:
            | Database["public"]["Enums"]["annotation_type"]
            | null
          color?: string | null
          coordinates?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          wsi_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "annotations_wsi_id_fkey"
            columns: ["wsi_id"]
            isOneToOne: false
            referencedRelation: "wsi_images"
            referencedColumns: ["id"]
          },
        ]
      }
      gene_expressions: {
        Row: {
          created_at: string | null
          expression_value: number
          gene_id: string | null
          id: string
          normalized_value: number | null
          st_point_id: string | null
        }
        Insert: {
          created_at?: string | null
          expression_value: number
          gene_id?: string | null
          id?: string
          normalized_value?: number | null
          st_point_id?: string | null
        }
        Update: {
          created_at?: string | null
          expression_value?: number
          gene_id?: string | null
          id?: string
          normalized_value?: number | null
          st_point_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gene_expressions_gene_id_fkey"
            columns: ["gene_id"]
            isOneToOne: false
            referencedRelation: "genes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gene_expressions_st_point_id_fkey"
            columns: ["st_point_id"]
            isOneToOne: false
            referencedRelation: "st_data_points"
            referencedColumns: ["id"]
          },
        ]
      }
      genes: {
        Row: {
          category: string | null
          chromosome: string | null
          created_at: string | null
          description: string | null
          gene_name: string | null
          gene_symbol: string
          id: string
        }
        Insert: {
          category?: string | null
          chromosome?: string | null
          created_at?: string | null
          description?: string | null
          gene_name?: string | null
          gene_symbol: string
          id?: string
        }
        Update: {
          category?: string | null
          chromosome?: string | null
          created_at?: string | null
          description?: string | null
          gene_name?: string | null
          gene_symbol?: string
          id?: string
        }
        Relationships: []
      }
      st_data_points: {
        Row: {
          barcode: string | null
          created_at: string | null
          id: string
          total_counts: number | null
          wsi_id: string | null
          x_coordinate: number
          y_coordinate: number
        }
        Insert: {
          barcode?: string | null
          created_at?: string | null
          id?: string
          total_counts?: number | null
          wsi_id?: string | null
          x_coordinate: number
          y_coordinate: number
        }
        Update: {
          barcode?: string | null
          created_at?: string | null
          id?: string
          total_counts?: number | null
          wsi_id?: string | null
          x_coordinate?: number
          y_coordinate?: number
        }
        Relationships: [
          {
            foreignKeyName: "st_data_points_wsi_id_fkey"
            columns: ["wsi_id"]
            isOneToOne: false
            referencedRelation: "wsi_images"
            referencedColumns: ["id"]
          },
        ]
      }
      wsi_images: {
        Row: {
          created_at: string | null
          file_size_mb: number | null
          filename: string
          id: string
          metadata: Json | null
          resolution_x: number
          resolution_y: number
          thumbnail_url: string | null
          tissue_type: Database["public"]["Enums"]["tissue_type"]
          upload_date: string | null
        }
        Insert: {
          created_at?: string | null
          file_size_mb?: number | null
          filename: string
          id?: string
          metadata?: Json | null
          resolution_x: number
          resolution_y: number
          thumbnail_url?: string | null
          tissue_type: Database["public"]["Enums"]["tissue_type"]
          upload_date?: string | null
        }
        Update: {
          created_at?: string | null
          file_size_mb?: number | null
          filename?: string
          id?: string
          metadata?: Json | null
          resolution_x?: number
          resolution_y?: number
          thumbnail_url?: string | null
          tissue_type?: Database["public"]["Enums"]["tissue_type"]
          upload_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      analysis_status: "pending" | "processing" | "completed" | "failed"
      annotation_type: "region" | "marker" | "measurement"
      tissue_type: "lung" | "breast" | "liver" | "brain" | "kidney" | "colon"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      analysis_status: ["pending", "processing", "completed", "failed"],
      annotation_type: ["region", "marker", "measurement"],
      tissue_type: ["lung", "breast", "liver", "brain", "kidney", "colon"],
    },
  },
} as const
