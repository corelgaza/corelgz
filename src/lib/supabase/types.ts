export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string;
          name: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      gallery_items: {
        Row: {
          id: string;
          src: string;
          alt: string;
          caption: string;
          sort_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          src: string;
          alt?: string;
          caption?: string;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          src?: string;
          alt?: string;
          caption?: string;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
