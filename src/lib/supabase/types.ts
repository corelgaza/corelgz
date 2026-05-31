export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ArticleStatus = "draft" | "published";

export type Database = {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string;
          name: string | null;
          message: string;
          visitor_id: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          message: string;
          visitor_id?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          message?: string;
          visitor_id?: string | null;
          ip_address?: string | null;
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
      page_views: {
        Row: {
          id: string;
          path: string;
          viewed_at: string;
          session_key: string | null;
        };
        Insert: {
          id?: string;
          path: string;
          viewed_at?: string;
          session_key?: string | null;
        };
        Update: {
          id?: string;
          path?: string;
          viewed_at?: string;
          session_key?: string | null;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          tags: string[];
          status: ArticleStatus;
          author_name: string;
          meta_title: string | null;
          meta_description: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          tags?: string[];
          status?: ArticleStatus;
          author_name?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          tags?: string[];
          status?: ArticleStatus;
          author_name?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      article_status: ArticleStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
