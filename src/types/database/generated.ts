export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      competitions: {
        Row: {
          badge: string | null;
          country: string | null;
          id: number;
          name: string;
          sport_id: number | null;
          standings: Json | null;
          updated_at: string | null;
        };
        Insert: {
          badge?: string | null;
          country?: string | null;
          id: number;
          name: string;
          sport_id?: number | null;
          standings?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          badge?: string | null;
          country?: string | null;
          id?: number;
          name?: string;
          sport_id?: number | null;
          standings?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'competitions_sport_id_fkey';
            columns: ['sport_id'];
            isOneToOne: false;
            referencedRelation: 'sports';
            referencedColumns: ['id'];
          },
        ];
      };
      matches: {
        Row: {
          away_score: number | null;
          away_team_data: Json | null;
          away_team_id: number | null;
          competition_id: number | null;
          events: Json | null;
          home_score: number | null;
          home_team_data: Json | null;
          home_team_id: number | null;
          id: number;
          kickoff: string | null;
          minute: string | null;
          round: string | null;
          sport_id: number | null;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          away_score?: number | null;
          away_team_data?: Json | null;
          away_team_id?: number | null;
          competition_id?: number | null;
          events?: Json | null;
          home_score?: number | null;
          home_team_data?: Json | null;
          home_team_id?: number | null;
          id: number;
          kickoff?: string | null;
          minute?: string | null;
          round?: string | null;
          sport_id?: number | null;
          status: string;
          updated_at?: string | null;
        };
        Update: {
          away_score?: number | null;
          away_team_data?: Json | null;
          away_team_id?: number | null;
          competition_id?: number | null;
          events?: Json | null;
          home_score?: number | null;
          home_team_data?: Json | null;
          home_team_id?: number | null;
          id?: number;
          kickoff?: string | null;
          minute?: string | null;
          round?: string | null;
          sport_id?: number | null;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'matches_competition_id_fkey';
            columns: ['competition_id'];
            isOneToOne: false;
            referencedRelation: 'competitions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'matches_sport_id_fkey';
            columns: ['sport_id'];
            isOneToOne: false;
            referencedRelation: 'sports';
            referencedColumns: ['id'];
          },
        ];
      };
      predictions: {
        Row: {
          away_score: number;
          competition_id: number | null;
          created_at: string | null;
          home_score: number;
          id: string;
          match_id: number;
          points: number | null;
          sport_id: number | null;
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          away_score: number;
          competition_id?: number | null;
          created_at?: string | null;
          home_score: number;
          id?: string;
          match_id: number;
          points?: number | null;
          sport_id?: number | null;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          away_score?: number;
          competition_id?: number | null;
          created_at?: string | null;
          home_score?: number;
          id?: string;
          match_id?: number;
          points?: number | null;
          sport_id?: number | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'predictions_competition_id_fkey';
            columns: ['competition_id'];
            isOneToOne: false;
            referencedRelation: 'competitions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'predictions_match_id_fkey';
            columns: ['match_id'];
            isOneToOne: false;
            referencedRelation: 'matches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'predictions_sport_id_fkey';
            columns: ['sport_id'];
            isOneToOne: false;
            referencedRelation: 'sports';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          id: string;
          points: number | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id: string;
          points?: number | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          points?: number | null;
          username?: string | null;
        };
        Relationships: [];
      };
      sports: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      leaderboard_competition: {
        Row: {
          avatar_url: string | null;
          competition_id: number | null;
          exact_hits: number | null;
          predictions_count: number | null;
          total_points: number | null;
          user_id: string | null;
          username: string | null;
        };
      };
      leaderboard_global: {
        Row: {
          avatar_url: string | null;
          exact_hits: number | null;
          predictions_count: number | null;
          total_points: number | null;
          user_id: string | null;
          username: string | null;
        };
      };
      leaderboard_sport: {
        Row: {
          avatar_url: string | null;
          exact_hits: number | null;
          predictions_count: number | null;
          sport_id: number | null;
          total_points: number | null;
          user_id: string | null;
          username: string | null;
        };
      };
    };
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

