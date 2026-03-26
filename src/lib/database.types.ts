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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      _epa_football_staging: {
        Row: {
          game_id: number | null
          id: number
          jersey: string | null
          opp_abbr: string | null
          opp_index: number | null
          player_name: string | null
          raw_value: string | null
          school_id: number | null
          season_id: number | null
          source_file: string | null
          stat_type: string | null
        }
        Insert: {
          game_id?: number | null
          id?: number
          jersey?: string | null
          opp_abbr?: string | null
          opp_index?: number | null
          player_name?: string | null
          raw_value?: string | null
          school_id?: number | null
          season_id?: number | null
          source_file?: string | null
          stat_type?: string | null
        }
        Update: {
          game_id?: number | null
          id?: number
          jersey?: string | null
          opp_abbr?: string | null
          opp_index?: number | null
          player_name?: string | null
          raw_value?: string | null
          school_id?: number | null
          season_id?: number | null
          source_file?: string | null
          stat_type?: string | null
        }
        Relationships: []
      }
      article_mentions: {
        Row: {
          article_id: number
          created_at: string | null
          entity_id: number
          entity_type: string
          id: number
        }
        Insert: {
          article_id: number
          created_at?: string | null
          entity_id: number
          entity_type: string
          id?: number
        }
        Update: {
          article_id?: number
          created_at?: string | null
          entity_id?: number
          entity_type?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "article_mentions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_name: string | null
          body: string
          championship_id: number | null
          content_type: string | null
          created_at: string | null
          deleted_at: string | null
          excerpt: string | null
          featured_at: string | null
          featured_image_url: string | null
          id: number
          player_id: number | null
          published_at: string | null
          school_id: number | null
          slug: string
          source_file: string | null
          sport_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          body: string
          championship_id?: number | null
          content_type?: string | null
          created_at?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          featured_at?: string | null
          featured_image_url?: string | null
          id?: number
          player_id?: number | null
          published_at?: string | null
          school_id?: number | null
          slug: string
          source_file?: string | null
          sport_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          body?: string
          championship_id?: number | null
          content_type?: string | null
          created_at?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          featured_at?: string | null
          featured_image_url?: string | null
          id?: number
          player_id?: number | null
          published_at?: string | null
          school_id?: number | null
          slug?: string
          source_file?: string | null
          sport_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_championship_id_fkey"
            columns: ["championship_id"]
            isOneToOne: false
            referencedRelation: "championships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "articles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "articles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "articles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "articles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "articles_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      awards: {
        Row: {
          award_name: string | null
          award_tier: string | null
          award_type: string
          category: string | null
          coach_id: number | null
          created_at: string | null
          id: number
          player_id: number | null
          player_name: string | null
          position: string | null
          region_id: string | null
          school_id: number | null
          season_id: number | null
          source: string | null
          source_file: string | null
          source_url: string | null
          sport_id: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          award_name?: string | null
          award_tier?: string | null
          award_type: string
          category?: string | null
          coach_id?: number | null
          created_at?: string | null
          id?: number
          player_id?: number | null
          player_name?: string | null
          position?: string | null
          region_id?: string | null
          school_id?: number | null
          season_id?: number | null
          source?: string | null
          source_file?: string | null
          source_url?: string | null
          sport_id?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          award_name?: string | null
          award_tier?: string | null
          award_type?: string
          category?: string | null
          coach_id?: number | null
          created_at?: string | null
          id?: number
          player_id?: number | null
          player_name?: string | null
          position?: string | null
          region_id?: string | null
          school_id?: number | null
          season_id?: number | null
          source?: string | null
          source_file?: string | null
          source_url?: string | null
          sport_id?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "awards_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "awards_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "awards_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_awards_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          badge_name: string
          badge_type: string
          created_at: string | null
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_name: string
          badge_type: string
          created_at?: string | null
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_name?: string
          badge_type?: string
          created_at?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      baseball_player_seasons: {
        Row: {
          at_bats: number | null
          batting_avg: number | null
          created_at: string | null
          doubles: number | null
          earned_runs: number | null
          era: number | null
          games_played: number | null
          hits: number | null
          hits_allowed: number | null
          home_runs: number | null
          id: number
          innings_pitched: number | null
          jersey_number: string | null
          losses: number | null
          obp: number | null
          ops: number | null
          player_id: number
          position_type: string | null
          rbi: number | null
          runs: number | null
          saves: number | null
          school_id: number | null
          season_id: number
          slg: number | null
          source_file: string | null
          stolen_bases: number | null
          strikeouts_b: number | null
          strikeouts_p: number | null
          triples: number | null
          updated_at: string | null
          walks: number | null
          walks_p: number | null
          wins: number | null
        }
        Insert: {
          at_bats?: number | null
          batting_avg?: number | null
          created_at?: string | null
          doubles?: number | null
          earned_runs?: number | null
          era?: number | null
          games_played?: number | null
          hits?: number | null
          hits_allowed?: number | null
          home_runs?: number | null
          id?: number
          innings_pitched?: number | null
          jersey_number?: string | null
          losses?: number | null
          obp?: number | null
          ops?: number | null
          player_id: number
          position_type?: string | null
          rbi?: number | null
          runs?: number | null
          saves?: number | null
          school_id?: number | null
          season_id: number
          slg?: number | null
          source_file?: string | null
          stolen_bases?: number | null
          strikeouts_b?: number | null
          strikeouts_p?: number | null
          triples?: number | null
          updated_at?: string | null
          walks?: number | null
          walks_p?: number | null
          wins?: number | null
        }
        Update: {
          at_bats?: number | null
          batting_avg?: number | null
          created_at?: string | null
          doubles?: number | null
          earned_runs?: number | null
          era?: number | null
          games_played?: number | null
          hits?: number | null
          hits_allowed?: number | null
          home_runs?: number | null
          id?: number
          innings_pitched?: number | null
          jersey_number?: string | null
          losses?: number | null
          obp?: number | null
          ops?: number | null
          player_id?: number
          position_type?: string | null
          rbi?: number | null
          runs?: number | null
          saves?: number | null
          school_id?: number | null
          season_id?: number
          slg?: number | null
          source_file?: string | null
          stolen_bases?: number | null
          strikeouts_b?: number | null
          strikeouts_p?: number | null
          triples?: number | null
          updated_at?: string | null
          walks?: number | null
          walks_p?: number | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "baseball_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "baseball_player_seasons_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      basketball_player_seasons: {
        Row: {
          apg: number | null
          assists: number | null
          blocks: number | null
          created_at: string | null
          def_rebounds: number | null
          fg_pct: number | null
          fga: number | null
          fgm: number | null
          ft_pct: number | null
          fta: number | null
          ftm: number | null
          games_played: number | null
          honor_level: string | null
          id: number
          jersey_number: string | null
          off_rebounds: number | null
          player_id: number
          points: number | null
          ppg: number | null
          rebounds: number | null
          rpg: number | null
          school_id: number | null
          season_id: number
          source_file: string | null
          steals: number | null
          three_pa: number | null
          three_pct: number | null
          three_pm: number | null
          turnovers: number | null
          updated_at: string | null
        }
        Insert: {
          apg?: number | null
          assists?: number | null
          blocks?: number | null
          created_at?: string | null
          def_rebounds?: number | null
          fg_pct?: number | null
          fga?: number | null
          fgm?: number | null
          ft_pct?: number | null
          fta?: number | null
          ftm?: number | null
          games_played?: number | null
          honor_level?: string | null
          id?: number
          jersey_number?: string | null
          off_rebounds?: number | null
          player_id: number
          points?: number | null
          ppg?: number | null
          rebounds?: number | null
          rpg?: number | null
          school_id?: number | null
          season_id: number
          source_file?: string | null
          steals?: number | null
          three_pa?: number | null
          three_pct?: number | null
          three_pm?: number | null
          turnovers?: number | null
          updated_at?: string | null
        }
        Update: {
          apg?: number | null
          assists?: number | null
          blocks?: number | null
          created_at?: string | null
          def_rebounds?: number | null
          fg_pct?: number | null
          fga?: number | null
          fgm?: number | null
          ft_pct?: number | null
          fta?: number | null
          ftm?: number | null
          games_played?: number | null
          honor_level?: string | null
          id?: number
          jersey_number?: string | null
          off_rebounds?: number | null
          player_id?: number
          points?: number | null
          ppg?: number | null
          rebounds?: number | null
          rpg?: number | null
          school_id?: number | null
          season_id?: number
          source_file?: string | null
          steals?: number | null
          three_pa?: number | null
          three_pct?: number | null
          three_pm?: number | null
          turnovers?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "basketball_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "basketball_player_seasons_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      championships: {
        Row: {
          championship_type: string | null
          created_at: string | null
          id: number
          league_id: number | null
          level: string | null
          notes: string | null
          opponent_id: number | null
          region_id: string | null
          result: string | null
          school_id: number | null
          score: string | null
          season_id: number | null
          source_file: string | null
          sport_id: string
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          championship_type?: string | null
          created_at?: string | null
          id?: number
          league_id?: number | null
          level?: string | null
          notes?: string | null
          opponent_id?: number | null
          region_id?: string | null
          result?: string | null
          school_id?: number | null
          score?: string | null
          season_id?: number | null
          source_file?: string | null
          sport_id: string
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          championship_type?: string | null
          created_at?: string | null
          id?: number
          league_id?: number | null
          level?: string | null
          notes?: string | null
          opponent_id?: number | null
          region_id?: string | null
          result?: string | null
          school_id?: number | null
          score?: string | null
          season_id?: number | null
          source_file?: string | null
          sport_id?: string
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "championships_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "championships_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "championships_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "championships_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "championships_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_championships_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      city_allstar_games: {
        Row: {
          attendance: number | null
          created_at: string | null
          game_date: string | null
          game_number: number | null
          id: number
          location: string | null
          nonpublic_score: number | null
          notes: string | null
          public_score: number | null
          silary_summary_url: string | null
          winner: string | null
          year: number
        }
        Insert: {
          attendance?: number | null
          created_at?: string | null
          game_date?: string | null
          game_number?: number | null
          id?: number
          location?: string | null
          nonpublic_score?: number | null
          notes?: string | null
          public_score?: number | null
          silary_summary_url?: string | null
          winner?: string | null
          year: number
        }
        Update: {
          attendance?: number | null
          created_at?: string | null
          game_date?: string | null
          game_number?: number | null
          id?: number
          location?: string | null
          nonpublic_score?: number | null
          notes?: string | null
          public_score?: number | null
          silary_summary_url?: string | null
          winner?: string | null
          year?: number
        }
        Relationships: []
      }
      city_allstar_participants: {
        Row: {
          created_at: string | null
          game_year: number | null
          id: number
          player_id: number | null
          player_name: string
          position: string | null
          scholarship_amount: number | null
          scholarship_recipient: boolean | null
          school: string | null
          school_id: number | null
          team: string | null
        }
        Insert: {
          created_at?: string | null
          game_year?: number | null
          id?: number
          player_id?: number | null
          player_name: string
          position?: string | null
          scholarship_amount?: number | null
          scholarship_recipient?: boolean | null
          school?: string | null
          school_id?: number | null
          team?: string | null
        }
        Update: {
          created_at?: string | null
          game_year?: number | null
          id?: number
          player_id?: number | null
          player_name?: string
          position?: string | null
          scholarship_amount?: number | null
          scholarship_recipient?: boolean | null
          school?: string | null
          school_id?: number | null
          team?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "city_allstar_participants_game_year_fkey"
            columns: ["game_year"]
            isOneToOne: false
            referencedRelation: "city_allstar_games"
            referencedColumns: ["year"]
          },
          {
            foreignKeyName: "city_allstar_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_allstar_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_allstar_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "city_allstar_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_allstar_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_allstar_participants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "city_allstar_participants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_allstar_participants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_allstar_participants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_allstar_participants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "city_allstar_participants_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
        ]
      }
      coach_claims: {
        Row: {
          coach_name: string
          email: string
          id: string
          message: string | null
          phone: string | null
          player_list: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          school_name: string
          sport: string
          status: string
          submitted_at: string
        }
        Insert: {
          coach_name: string
          email: string
          id?: string
          message?: string | null
          phone?: string | null
          player_list?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_name: string
          sport: string
          status?: string
          submitted_at?: string
        }
        Update: {
          coach_name?: string
          email?: string
          id?: string
          message?: string | null
          phone?: string | null
          player_list?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_name?: string
          sport?: string
          status?: string
          submitted_at?: string
        }
        Relationships: []
      }
      coaches: {
        Row: {
          bio: string | null
          created_at: string | null
          deleted_at: string | null
          id: number
          is_active: boolean | null
          name: string
          photo_url: string | null
          region_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          photo_url?: string | null
          region_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          photo_url?: string | null
          region_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaches_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_stints: {
        Row: {
          championships: number | null
          coach_id: number
          created_at: string | null
          end_year: number | null
          id: number
          notes: string | null
          record_losses: number | null
          record_ties: number | null
          record_wins: number | null
          role: string | null
          school_id: number
          sport_id: string
          start_year: number
          updated_at: string | null
        }
        Insert: {
          championships?: number | null
          coach_id: number
          created_at?: string | null
          end_year?: number | null
          id?: number
          notes?: string | null
          record_losses?: number | null
          record_ties?: number | null
          record_wins?: number | null
          role?: string | null
          school_id: number
          sport_id: string
          start_year: number
          updated_at?: string | null
        }
        Update: {
          championships?: number | null
          coach_id?: number
          created_at?: string | null
          end_year?: number | null
          id?: number
          notes?: string | null
          record_losses?: number | null
          record_ties?: number | null
          record_wins?: number | null
          role?: string | null
          school_id?: number
          sport_id?: string
          start_year?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaching_stints_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_stints_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "coaching_stints_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_stints_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_stints_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_stints_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_stints_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "coaching_stints_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          city: string | null
          conference: string | null
          created_at: string | null
          division: string
          id: number
          logo_url: string | null
          name: string
          state: string | null
          subdivision: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          conference?: string | null
          created_at?: string | null
          division: string
          id?: number
          logo_url?: string | null
          name: string
          state?: string | null
          subdivision?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          conference?: string | null
          created_at?: string | null
          division?: string
          id?: number
          logo_url?: string | null
          name?: string
          state?: string | null
          subdivision?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      coming_soon_signups: {
        Row: {
          email: string
          id: string
          name: string | null
          signed_up_at: string | null
        }
        Insert: {
          email: string
          id?: string
          name?: string | null
          signed_up_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          signed_up_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          article_id: number
          body: string
          created_at: string | null
          id: number
          parent_id: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          article_id: number
          body: string
          created_at?: string | null
          id?: number
          parent_id?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          article_id?: number
          body?: string
          created_at?: string | null
          id?: number
          parent_id?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      community_leagues: {
        Row: {
          age_group: string | null
          city: string | null
          contact_email: string | null
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          league_type: string
          name: string
          registration_url: string | null
          season_end: string | null
          season_start: string | null
          sport_id: string
          state: string | null
        }
        Insert: {
          age_group?: string | null
          city?: string | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: never
          is_active?: boolean | null
          league_type?: string
          name: string
          registration_url?: string | null
          season_end?: string | null
          season_start?: string | null
          sport_id?: string
          state?: string | null
        }
        Update: {
          age_group?: string | null
          city?: string | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          id?: never
          is_active?: boolean | null
          league_type?: string
          name?: string
          registration_url?: string | null
          season_end?: string | null
          season_start?: string | null
          sport_id?: string
          state?: string | null
        }
        Relationships: []
      }
      corrections: {
        Row: {
          created_at: string | null
          current_value: string | null
          entity_id: number
          entity_type: string
          field_name: string
          id: number
          reviewed_at: string | null
          reviewer_notes: string | null
          source_description: string | null
          status: string | null
          submitter_email: string | null
          submitter_name: string | null
          suggested_value: string
        }
        Insert: {
          created_at?: string | null
          current_value?: string | null
          entity_id: number
          entity_type: string
          field_name: string
          id?: number
          reviewed_at?: string | null
          reviewer_notes?: string | null
          source_description?: string | null
          status?: string | null
          submitter_email?: string | null
          submitter_name?: string | null
          suggested_value: string
        }
        Update: {
          created_at?: string | null
          current_value?: string | null
          entity_id?: number
          entity_type?: string
          field_name?: string
          id?: number
          reviewed_at?: string | null
          reviewer_notes?: string | null
          source_description?: string | null
          status?: string | null
          submitter_email?: string | null
          submitter_name?: string | null
          suggested_value?: string
        }
        Relationships: []
      }
      daily_polls: {
        Row: {
          active: boolean | null
          created_at: string | null
          ends_at: string | null
          id: string
          options: Json
          question: string
          sport_id: string | null
          starts_at: string | null
          total_votes: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          ends_at?: string | null
          id?: string
          options?: Json
          question: string
          sport_id?: string | null
          starts_at?: string | null
          total_votes?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          ends_at?: string | null
          id?: string
          options?: Json
          question?: string
          sport_id?: string | null
          starts_at?: string | null
          total_votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_polls_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      did_you_know: {
        Row: {
          approved: boolean | null
          category: string | null
          created_at: string | null
          era: string | null
          fact_text: string
          id: number
          player_id: number | null
          school_id: number | null
          sport: string | null
        }
        Insert: {
          approved?: boolean | null
          category?: string | null
          created_at?: string | null
          era?: string | null
          fact_text: string
          id?: number
          player_id?: number | null
          school_id?: number | null
          sport?: string | null
        }
        Update: {
          approved?: boolean | null
          category?: string | null
          created_at?: string | null
          era?: string | null
          fact_text?: string
          id?: number
          player_id?: number | null
          school_id?: number | null
          sport?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "did_you_know_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "did_you_know_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "did_you_know_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "did_you_know_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "did_you_know_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "did_you_know_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "did_you_know_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "did_you_know_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "did_you_know_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "did_you_know_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "did_you_know_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
        ]
      }
      email_logs: {
        Row: {
          email_type: string
          id: number
          resend_id: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          subscriber_id: number | null
        }
        Insert: {
          email_type: string
          id?: number
          resend_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          subscriber_id?: number | null
        }
        Update: {
          email_type?: string
          id?: number
          resend_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          subscriber_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "email_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_subscribers: {
        Row: {
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          email: string
          id: number
          name: string | null
          sport_preferences: string[] | null
          status: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email: string
          id?: number
          name?: string | null
          sport_preferences?: string[] | null
          status?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email?: string
          id?: number
          name?: string | null
          sport_preferences?: string[] | null
          status?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          event_type: string | null
          id: number
          location: string | null
          registration_url: string | null
          sport_id: string | null
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: number
          location?: string | null
          registration_url?: string | null
          sport_id?: string | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: number
          location?: string | null
          registration_url?: string | null
          sport_id?: string | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      football_player_seasons: {
        Row: {
          created_at: string | null
          games_played: number | null
          id: number
          interceptions: number | null
          jersey_number: string | null
          kick_ret_yards: number | null
          pass_att: number | null
          pass_comp: number | null
          pass_comp_pct: number | null
          pass_int: number | null
          pass_rating: number | null
          pass_td: number | null
          pass_yards: number | null
          player_id: number
          points: number | null
          punt_ret_yards: number | null
          rec_long: number | null
          rec_td: number | null
          rec_yards: number | null
          rec_ypr: number | null
          receptions: number | null
          rush_carries: number | null
          rush_long: number | null
          rush_td: number | null
          rush_yards: number | null
          rush_ypc: number | null
          sacks: number | null
          school_id: number | null
          season_id: number
          source_file: string | null
          tackles: number | null
          total_td: number | null
          total_yards: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          games_played?: number | null
          id?: number
          interceptions?: number | null
          jersey_number?: string | null
          kick_ret_yards?: number | null
          pass_att?: number | null
          pass_comp?: number | null
          pass_comp_pct?: number | null
          pass_int?: number | null
          pass_rating?: number | null
          pass_td?: number | null
          pass_yards?: number | null
          player_id: number
          points?: number | null
          punt_ret_yards?: number | null
          rec_long?: number | null
          rec_td?: number | null
          rec_yards?: number | null
          rec_ypr?: number | null
          receptions?: number | null
          rush_carries?: number | null
          rush_long?: number | null
          rush_td?: number | null
          rush_yards?: number | null
          rush_ypc?: number | null
          sacks?: number | null
          school_id?: number | null
          season_id: number
          source_file?: string | null
          tackles?: number | null
          total_td?: number | null
          total_yards?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          games_played?: number | null
          id?: number
          interceptions?: number | null
          jersey_number?: string | null
          kick_ret_yards?: number | null
          pass_att?: number | null
          pass_comp?: number | null
          pass_comp_pct?: number | null
          pass_int?: number | null
          pass_rating?: number | null
          pass_td?: number | null
          pass_yards?: number | null
          player_id?: number
          points?: number | null
          punt_ret_yards?: number | null
          rec_long?: number | null
          rec_td?: number | null
          rec_yards?: number | null
          rec_ypr?: number | null
          receptions?: number | null
          rush_carries?: number | null
          rush_long?: number | null
          rush_td?: number | null
          rush_yards?: number | null
          rush_ypc?: number | null
          sacks?: number | null
          school_id?: number | null
          season_id?: number
          source_file?: string | null
          tackles?: number | null
          total_td?: number | null
          total_yards?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "football_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "football_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "football_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "football_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_player_seasons_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "football_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "football_player_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "football_player_seasons_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          reply_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          reply_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          author_id: string | null
          author_name: string
          author_school_flair: string | null
          body: string
          category: string
          created_at: string
          deleted_at: string | null
          id: string
          is_locked: boolean
          is_pinned: boolean
          last_reply_at: string | null
          like_count: number
          reply_count: number
          school_id: number | null
          sport_id: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id?: string | null
          author_name: string
          author_school_flair?: string | null
          body: string
          category?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_reply_at?: string | null
          like_count?: number
          reply_count?: number
          school_id?: number | null
          sport_id?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string | null
          author_name?: string
          author_school_flair?: string | null
          body?: string
          category?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          last_reply_at?: string | null
          like_count?: number
          reply_count?: number
          school_id?: number | null
          sport_id?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "forum_posts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string | null
          author_name: string
          author_school_flair: string | null
          body: string
          created_at: string
          deleted_at: string | null
          id: string
          like_count: number
          parent_reply_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name: string
          author_school_flair?: string | null
          body: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          like_count?: number
          parent_reply_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          author_school_flair?: string | null
          body?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          like_count?: number
          parent_reply_id?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      game_of_the_week: {
        Row: {
          created_at: string | null
          description: string | null
          game_id: string | null
          id: string
          sport: string
          updated_at: string | null
          week_start: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          game_id?: string | null
          id?: string
          sport: string
          updated_at?: string | null
          week_start: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          game_id?: string | null
          id?: string
          sport?: string
          updated_at?: string | null
          week_start?: string
        }
        Relationships: []
      }
      game_player_stats: {
        Row: {
          created_at: string | null
          game_id: number | null
          id: number
          is_estimated: boolean | null
          jersey_number: string | null
          pass_completions: number | null
          pass_yards: number | null
          player_id: number | null
          player_name: string | null
          points: number | null
          rec_catches: number | null
          rec_yards: number | null
          rush_carries: number | null
          rush_yards: number | null
          school_id: number | null
          source_file: string | null
          source_type: string | null
          sport_id: string
          stats_json: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game_id?: number | null
          id?: number
          is_estimated?: boolean | null
          jersey_number?: string | null
          pass_completions?: number | null
          pass_yards?: number | null
          player_id?: number | null
          player_name?: string | null
          points?: number | null
          rec_catches?: number | null
          rec_yards?: number | null
          rush_carries?: number | null
          rush_yards?: number | null
          school_id?: number | null
          source_file?: string | null
          source_type?: string | null
          sport_id: string
          stats_json?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game_id?: number | null
          id?: number
          is_estimated?: boolean | null
          jersey_number?: string | null
          pass_completions?: number | null
          pass_yards?: number | null
          player_id?: number | null
          player_name?: string | null
          points?: number | null
          rec_catches?: number | null
          rec_yards?: number | null
          rush_carries?: number | null
          rush_yards?: number | null
          school_id?: number | null
          source_file?: string | null
          source_type?: string | null
          sport_id?: string
          stats_json?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_gps_game"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_gps_game"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_gps_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "fk_gps_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "fk_gps_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "fk_gps_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_gps_player"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_gps_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_player_stats_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "game_player_stats_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_player_stats_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_player_stats_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_player_stats_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_player_stats_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
        ]
      }
      games: {
        Row: {
          away_school_id: number | null
          away_score: number | null
          created_at: string | null
          data_source: string | null
          game_date: string | null
          game_time: string | null
          game_type: string | null
          home_school_id: number | null
          home_score: number | null
          id: number
          last_verified_at: string | null
          league_id: number | null
          notes: string | null
          period_scores: Json | null
          play_by_play: Json | null
          playoff_round: string | null
          region_id: string | null
          season_id: number
          sport_id: string
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          away_school_id?: number | null
          away_score?: number | null
          created_at?: string | null
          data_source?: string | null
          game_date?: string | null
          game_time?: string | null
          game_type?: string | null
          home_school_id?: number | null
          home_score?: number | null
          id?: number
          last_verified_at?: string | null
          league_id?: number | null
          notes?: string | null
          period_scores?: Json | null
          play_by_play?: Json | null
          playoff_round?: string | null
          region_id?: string | null
          season_id: number
          sport_id: string
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          away_school_id?: number | null
          away_score?: number | null
          created_at?: string | null
          data_source?: string | null
          game_date?: string | null
          game_time?: string | null
          game_type?: string | null
          home_school_id?: number | null
          home_score?: number | null
          id?: number
          last_verified_at?: string | null
          league_id?: number | null
          notes?: string | null
          period_scores?: Json | null
          play_by_play?: Json | null
          playoff_round?: string | null
          region_id?: string | null
          season_id?: number
          sport_id?: string
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_games_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "games_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "games_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      gotw_nominees: {
        Row: {
          away_school_id: number | null
          created_at: string | null
          description: string | null
          game_id: number | null
          home_school_id: number | null
          id: number
          is_winner: boolean | null
          season_id: number | null
          sport_id: string | null
          week_label: string | null
        }
        Insert: {
          away_school_id?: number | null
          created_at?: string | null
          description?: string | null
          game_id?: number | null
          home_school_id?: number | null
          id?: number
          is_winner?: boolean | null
          season_id?: number | null
          sport_id?: string | null
          week_label?: string | null
        }
        Update: {
          away_school_id?: number | null
          created_at?: string | null
          description?: string | null
          game_id?: number | null
          home_school_id?: number | null
          id?: number
          is_winner?: boolean | null
          season_id?: number | null
          sport_id?: string | null
          week_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gotw_nominees_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "gotw_nominees_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "gotw_nominees_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "gotw_nominees_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "gotw_nominees_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gotw_nominees_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      gotw_votes: {
        Row: {
          id: number
          nominee_id: number
          voted_at: string | null
          voter_fingerprint: string
        }
        Insert: {
          id?: number
          nominee_id: number
          voted_at?: string | null
          voter_fingerprint: string
        }
        Update: {
          id?: number
          nominee_id?: number
          voted_at?: string | null
          voter_fingerprint?: string
        }
        Relationships: [
          {
            foreignKeyName: "gotw_votes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "gotw_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      gotw_winners: {
        Row: {
          announced_at: string | null
          id: number
          nominee_id: number | null
          total_votes: number | null
        }
        Insert: {
          announced_at?: string | null
          id?: number
          nominee_id?: number | null
          total_votes?: number | null
        }
        Update: {
          announced_at?: string | null
          id?: number
          nominee_id?: number | null
          total_votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gotw_winners_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "gotw_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      hof_inductees: {
        Row: {
          achievements: string | null
          bio: string | null
          created_at: string | null
          graduation_year: number | null
          high_school: string | null
          id: number
          induction_class: string | null
          induction_year: number
          name: string
          notes: string | null
          organization_id: number | null
          player_id: number | null
          position: string | null
          professional_career: string | null
          role: string | null
          school_id: number | null
          slug: string | null
          sport: string | null
        }
        Insert: {
          achievements?: string | null
          bio?: string | null
          created_at?: string | null
          graduation_year?: number | null
          high_school?: string | null
          id?: number
          induction_class?: string | null
          induction_year: number
          name: string
          notes?: string | null
          organization_id?: number | null
          player_id?: number | null
          position?: string | null
          professional_career?: string | null
          role?: string | null
          school_id?: number | null
          slug?: string | null
          sport?: string | null
        }
        Update: {
          achievements?: string | null
          bio?: string | null
          created_at?: string | null
          graduation_year?: number | null
          high_school?: string | null
          id?: number
          induction_class?: string | null
          induction_year?: number
          name?: string
          notes?: string | null
          organization_id?: number | null
          player_id?: number | null
          position?: string | null
          professional_career?: string | null
          role?: string | null
          school_id?: number | null
          slug?: string | null
          sport?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hof_inductees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hof_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hof_inductees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "hof_inductees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "hof_inductees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "hof_inductees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hof_inductees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hof_inductees_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "hof_inductees_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hof_inductees_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hof_inductees_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hof_inductees_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hof_inductees_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
        ]
      }
      hof_organizations: {
        Row: {
          badge_color_primary: string | null
          badge_color_secondary: string | null
          badge_icon: string | null
          badge_label: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: number
          name: string
          psp_subpage: boolean | null
          slug: string
          subpage_url: string | null
          type: string
          website_url: string | null
        }
        Insert: {
          badge_color_primary?: string | null
          badge_color_secondary?: string | null
          badge_icon?: string | null
          badge_label?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: number
          name: string
          psp_subpage?: boolean | null
          slug: string
          subpage_url?: string | null
          type: string
          website_url?: string | null
        }
        Update: {
          badge_color_primary?: string | null
          badge_color_secondary?: string | null
          badge_icon?: string | null
          badge_label?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: number
          name?: string
          psp_subpage?: boolean | null
          slug?: string
          subpage_url?: string | null
          type?: string
          website_url?: string | null
        }
        Relationships: []
      }
      leagues: {
        Row: {
          created_at: string | null
          founded_year: number | null
          id: number
          level: string | null
          name: string
          region_id: string | null
          short_name: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          founded_year?: number | null
          id?: number
          level?: string | null
          name: string
          region_id?: string | null
          short_name?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          founded_year?: number | null
          id?: number
          level?: string | null
          name?: string
          region_id?: string | null
          short_name?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leagues_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      next_level_tracking: {
        Row: {
          bio_note: string | null
          bio_url: string | null
          college: string | null
          college_sport: string | null
          created_at: string | null
          current_level: string
          current_org: string | null
          current_role: string | null
          draft_info: string | null
          featured: boolean | null
          headshot_url: string | null
          high_school_id: number | null
          id: number
          person_name: string
          player_id: number | null
          pro_league: string | null
          pro_team: string | null
          slug: string | null
          social_instagram: string | null
          social_twitter: string | null
          sport_id: string | null
          status: string | null
          trajectory_label: string | null
          trajectory_score: number | null
          updated_at: string | null
          url_bbref: string | null
          url_brref: string | null
          url_espn: string | null
          url_pfr: string | null
          url_wikipedia: string | null
        }
        Insert: {
          bio_note?: string | null
          bio_url?: string | null
          college?: string | null
          college_sport?: string | null
          created_at?: string | null
          current_level?: string
          current_org?: string | null
          current_role?: string | null
          draft_info?: string | null
          featured?: boolean | null
          headshot_url?: string | null
          high_school_id?: number | null
          id?: number
          person_name: string
          player_id?: number | null
          pro_league?: string | null
          pro_team?: string | null
          slug?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          sport_id?: string | null
          status?: string | null
          trajectory_label?: string | null
          trajectory_score?: number | null
          updated_at?: string | null
          url_bbref?: string | null
          url_brref?: string | null
          url_espn?: string | null
          url_pfr?: string | null
          url_wikipedia?: string | null
        }
        Update: {
          bio_note?: string | null
          bio_url?: string | null
          college?: string | null
          college_sport?: string | null
          created_at?: string | null
          current_level?: string
          current_org?: string | null
          current_role?: string | null
          draft_info?: string | null
          featured?: boolean | null
          headshot_url?: string | null
          high_school_id?: number | null
          id?: number
          person_name?: string
          player_id?: number | null
          pro_league?: string | null
          pro_team?: string | null
          slug?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          sport_id?: string | null
          status?: string | null
          trajectory_label?: string | null
          trajectory_score?: number | null
          updated_at?: string | null
          url_bbref?: string | null
          url_brref?: string | null
          url_espn?: string | null
          url_pfr?: string | null
          url_wikipedia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "next_level_tracking_high_school_id_fkey"
            columns: ["high_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "next_level_tracking_high_school_id_fkey"
            columns: ["high_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "next_level_tracking_high_school_id_fkey"
            columns: ["high_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "next_level_tracking_high_school_id_fkey"
            columns: ["high_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "next_level_tracking_high_school_id_fkey"
            columns: ["high_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "next_level_tracking_high_school_id_fkey"
            columns: ["high_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "next_level_tracking_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "next_level_tracking_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "next_level_tracking_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "next_level_tracking_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "next_level_tracking_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "next_level_tracking_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          approved: boolean | null
          caption: string | null
          created_at: string | null
          featured: boolean | null
          game_id: number | null
          id: number
          photo_url: string
          player_tags: number[] | null
          school_id: number | null
          season_id: number | null
          sport_id: string | null
          thumbnail_url: string | null
          uploaded_by: string | null
        }
        Insert: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string | null
          featured?: boolean | null
          game_id?: number | null
          id?: number
          photo_url: string
          player_tags?: number[] | null
          school_id?: number | null
          season_id?: number | null
          sport_id?: string | null
          thumbnail_url?: string | null
          uploaded_by?: string | null
        }
        Update: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string | null
          featured?: boolean | null
          game_id?: number | null
          id?: number
          photo_url?: string
          player_tags?: number[] | null
          school_id?: number | null
          season_id?: number | null
          sport_id?: string | null
          thumbnail_url?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "photos_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "photos_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      pickem_games: {
        Row: {
          away_school_id: number | null
          created_at: string | null
          featured: boolean | null
          game_id: number | null
          home_school_id: number | null
          id: number
          week_id: number | null
        }
        Insert: {
          away_school_id?: number | null
          created_at?: string | null
          featured?: boolean | null
          game_id?: number | null
          home_school_id?: number | null
          id?: number
          week_id?: number | null
        }
        Update: {
          away_school_id?: number | null
          created_at?: string | null
          featured?: boolean | null
          game_id?: number | null
          home_school_id?: number | null
          id?: number
          week_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pickem_games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "pickem_games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "pickem_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "pickem_games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "pickem_games_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "pickem_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      pickem_leaderboard: {
        Row: {
          best_streak: number | null
          correct_picks: number | null
          current_streak: number | null
          id: number
          season_id: number | null
          sport_id: string | null
          total_picks: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          best_streak?: number | null
          correct_picks?: number | null
          current_streak?: number | null
          id?: number
          season_id?: number | null
          sport_id?: string | null
          total_picks?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          best_streak?: number | null
          correct_picks?: number | null
          current_streak?: number | null
          id?: number
          season_id?: number | null
          sport_id?: string | null
          total_picks?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickem_leaderboard_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_leaderboard_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      pickem_picks: {
        Row: {
          created_at: string | null
          game_id: number | null
          id: number
          is_correct: boolean | null
          picked_school_id: number | null
          user_id: string
          week_id: number | null
        }
        Insert: {
          created_at?: string | null
          game_id?: number | null
          id?: number
          is_correct?: boolean | null
          picked_school_id?: number | null
          user_id: string
          week_id?: number | null
        }
        Update: {
          created_at?: string | null
          game_id?: number | null
          id?: number
          is_correct?: boolean | null
          picked_school_id?: number | null
          user_id?: string
          week_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pickem_picks_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "pickem_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_picks_picked_school_id_fkey"
            columns: ["picked_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "pickem_picks_picked_school_id_fkey"
            columns: ["picked_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_picks_picked_school_id_fkey"
            columns: ["picked_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_picks_picked_school_id_fkey"
            columns: ["picked_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_picks_picked_school_id_fkey"
            columns: ["picked_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_picks_picked_school_id_fkey"
            columns: ["picked_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "pickem_picks_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "pickem_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      pickem_weeks: {
        Row: {
          closes_at: string | null
          created_at: string | null
          id: number
          opens_at: string | null
          season_id: number | null
          sport_id: string | null
          status: string | null
          title: string | null
          week_number: number
        }
        Insert: {
          closes_at?: string | null
          created_at?: string | null
          id?: number
          opens_at?: string | null
          season_id?: number | null
          sport_id?: string | null
          status?: string | null
          title?: string | null
          week_number: number
        }
        Update: {
          closes_at?: string | null
          created_at?: string | null
          id?: number
          opens_at?: string | null
          season_id?: number | null
          sport_id?: string | null
          status?: string | null
          title?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "pickem_weeks_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickem_weeks_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      player_claims: {
        Row: {
          claimant_email: string
          claimant_name: string
          claimant_phone: string | null
          consent_academic: boolean | null
          consent_contact: boolean | null
          consent_date: string | null
          consent_email: boolean | null
          consent_film: boolean | null
          created_at: string | null
          id: number
          measurables: Json | null
          parent_email: string | null
          parent_name: string | null
          player_id: number | null
          recruiting_prefs: Json | null
          recruiting_status: string | null
          relationship: string
          social_links: Json | null
          status: string | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          claimant_email: string
          claimant_name: string
          claimant_phone?: string | null
          consent_academic?: boolean | null
          consent_contact?: boolean | null
          consent_date?: string | null
          consent_email?: boolean | null
          consent_film?: boolean | null
          created_at?: string | null
          id?: number
          measurables?: Json | null
          parent_email?: string | null
          parent_name?: string | null
          player_id?: number | null
          recruiting_prefs?: Json | null
          recruiting_status?: string | null
          relationship?: string
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          claimant_email?: string
          claimant_name?: string
          claimant_phone?: string | null
          consent_academic?: boolean | null
          consent_contact?: boolean | null
          consent_date?: string | null
          consent_email?: boolean | null
          consent_film?: boolean | null
          created_at?: string | null
          id?: number
          measurables?: Json | null
          parent_email?: string | null
          parent_name?: string | null
          player_id?: number | null
          recruiting_prefs?: Json | null
          recruiting_status?: string | null
          relationship?: string
          social_links?: Json | null
          status?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_claims_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_claims_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_claims_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_claims_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_claims_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
        ]
      }
      player_highlights: {
        Row: {
          created_at: string | null
          game_id: number | null
          hudl_url: string
          id: number
          is_featured: boolean | null
          player_id: number | null
          season_id: number | null
          sport_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game_id?: number | null
          hudl_url: string
          id?: number
          is_featured?: boolean | null
          player_id?: number | null
          season_id?: number | null
          sport_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game_id?: number | null
          hudl_url?: string
          id?: number
          is_featured?: boolean | null
          player_id?: number | null
          season_id?: number | null
          sport_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_highlights_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_highlights_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_highlights_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_highlights_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_highlights_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_highlights_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_highlights_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_highlights_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_highlights_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      player_hof_badges: {
        Row: {
          created_at: string | null
          display_on_profile: boolean | null
          hof_inductee_id: number | null
          id: number
          organization_id: number | null
          player_id: number | null
        }
        Insert: {
          created_at?: string | null
          display_on_profile?: boolean | null
          hof_inductee_id?: number | null
          id?: number
          organization_id?: number | null
          player_id?: number | null
        }
        Update: {
          created_at?: string | null
          display_on_profile?: boolean | null
          hof_inductee_id?: number | null
          id?: number
          organization_id?: number | null
          player_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_hof_badges_hof_inductee_id_fkey"
            columns: ["hof_inductee_id"]
            isOneToOne: false
            referencedRelation: "hof_inductees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_hof_badges_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hof_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_hof_badges_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_hof_badges_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_hof_badges_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_hof_badges_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_hof_badges_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
        ]
      }
      player_news_cache: {
        Row: {
          fetched_at: string | null
          id: number
          player_id: number | null
          player_name: string
          published_at: string | null
          source: string | null
          title: string
          url: string
        }
        Insert: {
          fetched_at?: string | null
          id?: number
          player_id?: number | null
          player_name: string
          published_at?: string | null
          source?: string | null
          title: string
          url: string
        }
        Update: {
          fetched_at?: string | null
          id?: number
          player_id?: number | null
          player_name?: string
          published_at?: string | null
          source?: string | null
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_news_cache_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_news_cache_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_news_cache_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "player_news_cache_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_news_cache_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
        ]
      }
      player_reactions: {
        Row: {
          count: number
          id: string
          player_slug: string
          reaction: string
          updated_at: string
        }
        Insert: {
          count?: number
          id?: string
          player_slug: string
          reaction: string
          updated_at?: string
        }
        Update: {
          count?: number
          id?: string
          player_slug?: string
          reaction?: string
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          bio: string | null
          college: string | null
          college_sport: string | null
          contact_email: string | null
          created_at: string | null
          deleted_at: string | null
          first_name: string | null
          graduation_year: number | null
          height: string | null
          hudl_profile_url: string | null
          id: number
          instagram_handle: string | null
          is_multi_sport: boolean | null
          is_verified: boolean | null
          last_name: string | null
          name: string
          photo_url: string | null
          positions: string[] | null
          primary_school_id: number | null
          pro_draft_info: string | null
          pro_team: string | null
          recruiting_status: string | null
          region_id: string | null
          slug: string
          twitter_handle: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          bio?: string | null
          college?: string | null
          college_sport?: string | null
          contact_email?: string | null
          created_at?: string | null
          deleted_at?: string | null
          first_name?: string | null
          graduation_year?: number | null
          height?: string | null
          hudl_profile_url?: string | null
          id?: number
          instagram_handle?: string | null
          is_multi_sport?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          name: string
          photo_url?: string | null
          positions?: string[] | null
          primary_school_id?: number | null
          pro_draft_info?: string | null
          pro_team?: string | null
          recruiting_status?: string | null
          region_id?: string | null
          slug: string
          twitter_handle?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          bio?: string | null
          college?: string | null
          college_sport?: string | null
          contact_email?: string | null
          created_at?: string | null
          deleted_at?: string | null
          first_name?: string | null
          graduation_year?: number | null
          height?: string | null
          hudl_profile_url?: string | null
          id?: number
          instagram_handle?: string | null
          is_multi_sport?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          name?: string
          photo_url?: string | null
          positions?: string[] | null
          primary_school_id?: number | null
          pro_draft_info?: string | null
          pro_team?: string | null
          recruiting_status?: string | null
          region_id?: string | null
          slug?: string
          twitter_handle?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "players_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      playoff_bracket_games: {
        Row: {
          bracket_id: number
          created_at: string | null
          game_date: string | null
          game_id: number | null
          game_number: number
          id: number
          next_game_id: number | null
          round_name: string
          round_number: number
          team1_name: string | null
          team1_school_id: number | null
          team1_score: number | null
          team1_seed: number | null
          team2_name: string | null
          team2_school_id: number | null
          team2_score: number | null
          team2_seed: number | null
          winner_school_id: number | null
        }
        Insert: {
          bracket_id: number
          created_at?: string | null
          game_date?: string | null
          game_id?: number | null
          game_number: number
          id?: number
          next_game_id?: number | null
          round_name: string
          round_number: number
          team1_name?: string | null
          team1_school_id?: number | null
          team1_score?: number | null
          team1_seed?: number | null
          team2_name?: string | null
          team2_school_id?: number | null
          team2_score?: number | null
          team2_seed?: number | null
          winner_school_id?: number | null
        }
        Update: {
          bracket_id?: number
          created_at?: string | null
          game_date?: string | null
          game_id?: number | null
          game_number?: number
          id?: number
          next_game_id?: number | null
          round_name?: string
          round_number?: number
          team1_name?: string | null
          team1_school_id?: number | null
          team1_score?: number | null
          team1_seed?: number | null
          team2_name?: string | null
          team2_school_id?: number | null
          team2_score?: number | null
          team2_seed?: number | null
          winner_school_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "playoff_bracket_games_bracket_id_fkey"
            columns: ["bracket_id"]
            isOneToOne: false
            referencedRelation: "playoff_brackets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_next_game_id_fkey"
            columns: ["next_game_id"]
            isOneToOne: false
            referencedRelation: "playoff_bracket_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team1_school_id_fkey"
            columns: ["team1_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team1_school_id_fkey"
            columns: ["team1_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team1_school_id_fkey"
            columns: ["team1_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team1_school_id_fkey"
            columns: ["team1_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team1_school_id_fkey"
            columns: ["team1_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team1_school_id_fkey"
            columns: ["team1_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team2_school_id_fkey"
            columns: ["team2_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team2_school_id_fkey"
            columns: ["team2_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team2_school_id_fkey"
            columns: ["team2_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team2_school_id_fkey"
            columns: ["team2_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team2_school_id_fkey"
            columns: ["team2_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_team2_school_id_fkey"
            columns: ["team2_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_winner_school_id_fkey"
            columns: ["winner_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_winner_school_id_fkey"
            columns: ["winner_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_winner_school_id_fkey"
            columns: ["winner_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_winner_school_id_fkey"
            columns: ["winner_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_winner_school_id_fkey"
            columns: ["winner_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_bracket_games_winner_school_id_fkey"
            columns: ["winner_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
        ]
      }
      playoff_brackets: {
        Row: {
          bracket_type: string
          classification: string | null
          created_at: string | null
          id: number
          name: string
          season_id: number
          sport_id: string
        }
        Insert: {
          bracket_type: string
          classification?: string | null
          created_at?: string | null
          id?: number
          name: string
          season_id: number
          sport_id: string
        }
        Update: {
          bracket_type?: string
          classification?: string | null
          created_at?: string | null
          id?: number
          name?: string
          season_id?: number
          sport_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playoff_brackets_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playoff_brackets_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      plyw_nominees: {
        Row: {
          created_at: string | null
          description: string | null
          game_id: number | null
          id: number
          is_winner: boolean | null
          player_id: number | null
          player_name: string
          school_name: string | null
          season_id: number | null
          sport_id: string | null
          video_url: string | null
          votes: number | null
          week_label: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          game_id?: number | null
          id?: number
          is_winner?: boolean | null
          player_id?: number | null
          player_name: string
          school_name?: string | null
          season_id?: number | null
          sport_id?: string | null
          video_url?: string | null
          votes?: number | null
          week_label?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          game_id?: number | null
          id?: number
          is_winner?: boolean | null
          player_id?: number | null
          player_name?: string
          school_name?: string | null
          season_id?: number | null
          sport_id?: string | null
          video_url?: string | null
          votes?: number | null
          week_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plyw_nominees_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plyw_nominees_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plyw_nominees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "plyw_nominees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "plyw_nominees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "plyw_nominees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plyw_nominees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plyw_nominees_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plyw_nominees_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      plyw_votes: {
        Row: {
          created_at: string | null
          id: number
          nominee_id: number
          voter_fingerprint: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          nominee_id: number
          voter_fingerprint?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nominee_id?: number
          voter_fingerprint?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plyw_votes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "plyw_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      plyw_winners: {
        Row: {
          announced_at: string | null
          created_at: string | null
          id: number
          nominee_id: number
          season_id: number | null
          sport_id: string | null
          week_label: string | null
        }
        Insert: {
          announced_at?: string | null
          created_at?: string | null
          id?: number
          nominee_id: number
          season_id?: number | null
          sport_id?: string | null
          week_label?: string | null
        }
        Update: {
          announced_at?: string | null
          created_at?: string | null
          id?: number
          nominee_id?: number
          season_id?: number | null
          sport_id?: string | null
          week_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plyw_winners_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "plyw_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plyw_winners_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plyw_winners_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string | null
          id: string
          option_index: number
          poll_id: string | null
          voter_fingerprint: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_index: number
          poll_id?: string | null
          voter_fingerprint: string
        }
        Update: {
          created_at?: string | null
          id?: string
          option_index?: number
          poll_id?: string | null
          voter_fingerprint?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "daily_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          category: string | null
          code: string
          id: number
          name: string
          sort_order: number | null
          sport_id: string
        }
        Insert: {
          category?: string | null
          code: string
          id?: number
          name: string
          sort_order?: number | null
          sport_id: string
        }
        Update: {
          category?: string | null
          code?: string
          id?: number
          name?: string
          sort_order?: number | null
          sport_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      potw_nominees: {
        Row: {
          created_at: string | null
          id: number
          is_winner: boolean | null
          player_id: number | null
          player_name: string
          school_name: string | null
          season_id: number | null
          sport_id: string | null
          stat_line: string | null
          votes: number | null
          week_label: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_winner?: boolean | null
          player_id?: number | null
          player_name: string
          school_name?: string | null
          season_id?: number | null
          sport_id?: string | null
          stat_line?: string | null
          votes?: number | null
          week_label?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_winner?: boolean | null
          player_id?: number | null
          player_name?: string
          school_name?: string | null
          season_id?: number | null
          sport_id?: string | null
          stat_line?: string | null
          votes?: number | null
          week_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "potw_nominees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "potw_nominees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "potw_nominees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "potw_nominees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "potw_nominees_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "potw_nominees_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "potw_nominees_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      potw_votes: {
        Row: {
          id: number
          nominee_id: number
          voted_at: string | null
          voter_fingerprint: string
        }
        Insert: {
          id?: number
          nominee_id: number
          voted_at?: string | null
          voter_fingerprint: string
        }
        Update: {
          id?: number
          nominee_id?: number
          voted_at?: string | null
          voter_fingerprint?: string
        }
        Relationships: [
          {
            foreignKeyName: "potw_votes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "potw_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      potw_winners: {
        Row: {
          created_at: string | null
          id: number
          player_name: string
          school_name: string | null
          sport_id: string | null
          vote_count: number | null
          week: number
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          player_name: string
          school_name?: string | null
          sport_id?: string | null
          vote_count?: number | null
          week: number
          year: number
        }
        Update: {
          created_at?: string | null
          id?: number
          player_name?: string
          school_name?: string | null
          sport_id?: string | null
          vote_count?: number | null
          week?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "potw_winners_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      power_rankings: {
        Row: {
          blurb: string | null
          created_at: string
          id: string
          previous_rank: number | null
          published_at: string
          rank_position: number
          ranking_category: string | null
          ranking_type: string | null
          record_display: string | null
          school_id: number
          season_id: number | null
          sport_id: string
          week_label: string
        }
        Insert: {
          blurb?: string | null
          created_at?: string
          id?: string
          previous_rank?: number | null
          published_at?: string
          rank_position: number
          ranking_category?: string | null
          ranking_type?: string | null
          record_display?: string | null
          school_id: number
          season_id?: number | null
          sport_id: string
          week_label: string
        }
        Update: {
          blurb?: string | null
          created_at?: string
          id?: string
          previous_rank?: number | null
          published_at?: string
          rank_position?: number
          ranking_category?: string | null
          ranking_type?: string | null
          record_display?: string | null
          school_id?: number
          season_id?: number | null
          sport_id?: string
          week_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_power_rankings_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "power_rankings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "power_rankings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "power_rankings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "power_rankings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "power_rankings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "power_rankings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "power_rankings_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      records: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          game_id: number | null
          holder_name: string | null
          holder_school: string | null
          id: number
          player_id: number | null
          record_number: number | null
          record_value: string
          region_id: string | null
          school_id: number | null
          scope: string | null
          season_id: number | null
          source_url: string | null
          sport_id: string
          subcategory: string | null
          updated_at: string | null
          verified: boolean | null
          year_set: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          game_id?: number | null
          holder_name?: string | null
          holder_school?: string | null
          id?: number
          player_id?: number | null
          record_number?: number | null
          record_value: string
          region_id?: string | null
          school_id?: number | null
          scope?: string | null
          season_id?: number | null
          source_url?: string | null
          sport_id: string
          subcategory?: string | null
          updated_at?: string | null
          verified?: boolean | null
          year_set?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          game_id?: number | null
          holder_name?: string | null
          holder_school?: string | null
          id?: number
          player_id?: number | null
          record_number?: number | null
          record_value?: string
          region_id?: string | null
          school_id?: number | null
          scope?: string | null
          season_id?: number | null
          source_url?: string | null
          sport_id?: string
          subcategory?: string | null
          updated_at?: string | null
          verified?: boolean | null
          year_set?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "records_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "records_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "records_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "records_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "records_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiting_interest: {
        Row: {
          email: string
          first_name: string
          gpa: number | null
          graduation_year: number | null
          height: string | null
          highlight_url: string | null
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          positions: string | null
          sport: string
          submitted_at: string
          target_level: string | null
          weight: string | null
        }
        Insert: {
          email: string
          first_name: string
          gpa?: number | null
          graduation_year?: number | null
          height?: string | null
          highlight_url?: string | null
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          positions?: string | null
          sport: string
          submitted_at?: string
          target_level?: string | null
          weight?: string | null
        }
        Update: {
          email?: string
          first_name?: string
          gpa?: number | null
          graduation_year?: number | null
          height?: string | null
          highlight_url?: string | null
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          positions?: string | null
          sport?: string
          submitted_at?: string
          target_level?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      recruiting_offers: {
        Row: {
          college_id: number
          commitment_date: string | null
          created_at: string | null
          id: number
          notes: string | null
          offer_date: string | null
          recruiting_profile_id: number
          scholarship_type: string | null
          status: string
          updated_at: string | null
          visit_date: string | null
        }
        Insert: {
          college_id: number
          commitment_date?: string | null
          created_at?: string | null
          id?: number
          notes?: string | null
          offer_date?: string | null
          recruiting_profile_id: number
          scholarship_type?: string | null
          status?: string
          updated_at?: string | null
          visit_date?: string | null
        }
        Update: {
          college_id?: number
          commitment_date?: string | null
          created_at?: string | null
          id?: number
          notes?: string | null
          offer_date?: string | null
          recruiting_profile_id?: number
          scholarship_type?: string | null
          status?: string
          updated_at?: string | null
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recruiting_offers_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiting_offers_recruiting_profile_id_fkey"
            columns: ["recruiting_profile_id"]
            isOneToOne: false
            referencedRelation: "recruiting_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiting_profiles: {
        Row: {
          class_year: number
          committed_college_id: number | null
          committed_date: string | null
          committed_school: string | null
          composite_rating: number | null
          created_at: string | null
          featured: boolean | null
          forty_time: number | null
          height: string | null
          highlights_url: string | null
          id: number
          last_updated: string | null
          notes: string | null
          offers: string[] | null
          player_id: number | null
          position: string | null
          ranking_247: number | null
          ranking_espn: number | null
          ranking_on3: number | null
          ranking_rivals: number | null
          ratings: Json | null
          shuttle_time: number | null
          signing_date: string | null
          sport_id: string | null
          star_rating: number | null
          status: string | null
          twitter_handle: string | null
          url_247: string | null
          url_hudl: string | null
          url_maxpreps: string | null
          url_on3: string | null
          url_rivals: string | null
          vertical_inches: number | null
          weight: number | null
        }
        Insert: {
          class_year: number
          committed_college_id?: number | null
          committed_date?: string | null
          committed_school?: string | null
          composite_rating?: number | null
          created_at?: string | null
          featured?: boolean | null
          forty_time?: number | null
          height?: string | null
          highlights_url?: string | null
          id?: number
          last_updated?: string | null
          notes?: string | null
          offers?: string[] | null
          player_id?: number | null
          position?: string | null
          ranking_247?: number | null
          ranking_espn?: number | null
          ranking_on3?: number | null
          ranking_rivals?: number | null
          ratings?: Json | null
          shuttle_time?: number | null
          signing_date?: string | null
          sport_id?: string | null
          star_rating?: number | null
          status?: string | null
          twitter_handle?: string | null
          url_247?: string | null
          url_hudl?: string | null
          url_maxpreps?: string | null
          url_on3?: string | null
          url_rivals?: string | null
          vertical_inches?: number | null
          weight?: number | null
        }
        Update: {
          class_year?: number
          committed_college_id?: number | null
          committed_date?: string | null
          committed_school?: string | null
          composite_rating?: number | null
          created_at?: string | null
          featured?: boolean | null
          forty_time?: number | null
          height?: string | null
          highlights_url?: string | null
          id?: number
          last_updated?: string | null
          notes?: string | null
          offers?: string[] | null
          player_id?: number | null
          position?: string | null
          ranking_247?: number | null
          ranking_espn?: number | null
          ranking_on3?: number | null
          ranking_rivals?: number | null
          ratings?: Json | null
          shuttle_time?: number | null
          signing_date?: string | null
          sport_id?: string | null
          star_rating?: number | null
          status?: string | null
          twitter_handle?: string | null
          url_247?: string | null
          url_hudl?: string | null
          url_maxpreps?: string | null
          url_on3?: string | null
          url_rivals?: string | null
          vertical_inches?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recruiting_profiles_committed_college_id_fkey"
            columns: ["committed_college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiting_profiles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "recruiting_profiles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "recruiting_profiles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "recruiting_profiles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiting_profiles_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiting_profiles_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiting_updates: {
        Row: {
          created_at: string | null
          event_date: string | null
          id: number
          metadata: Json | null
          player_id: number | null
          source: string
          source_url: string | null
          summary: string | null
          title: string
          update_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_date?: string | null
          id?: number
          metadata?: Json | null
          player_id?: number | null
          source?: string
          source_url?: string | null
          summary?: string | null
          title: string
          update_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_date?: string | null
          id?: number
          metadata?: Json | null
          player_id?: number | null
          source?: string
          source_url?: string | null
          summary?: string | null
          title?: string
          update_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recruiting_updates_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "recruiting_updates_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "recruiting_updates_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "recruiting_updates_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recruiting_updates_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string | null
          id: string
          metro_area: string | null
          name: string
          slug: string | null
          state: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          metro_area?: string | null
          name: string
          slug?: string | null
          state?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metro_area?: string | null
          name?: string
          slug?: string | null
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rivalries: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          featured: boolean | null
          id: number
          region_id: string | null
          school_a_id: number
          school_b_id: number
          slug: string
          sport_id: string
          subtitle: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          featured?: boolean | null
          id?: number
          region_id?: string | null
          school_a_id: number
          school_b_id: number
          slug: string
          sport_id: string
          subtitle?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          featured?: boolean | null
          id?: number
          region_id?: string | null
          school_a_id?: number
          school_b_id?: number
          slug?: string
          sport_id?: string
          subtitle?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rivalries_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rivalries_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      rivalry_notes: {
        Row: {
          content: string
          created_at: string | null
          game_id: number | null
          id: number
          note_type: string
          rivalry_id: number
          sort_order: number | null
          title: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          game_id?: number | null
          id?: number
          note_type?: string
          rivalry_id: number
          sort_order?: number | null
          title?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          game_id?: number | null
          id?: number
          note_type?: string
          rivalry_id?: number
          sort_order?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rivalry_notes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalry_notes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalry_notes_rivalry_id_fkey"
            columns: ["rivalry_id"]
            isOneToOne: false
            referencedRelation: "rivalries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalry_notes_rivalry_id_fkey"
            columns: ["rivalry_id"]
            isOneToOne: false
            referencedRelation: "rivalry_records"
            referencedColumns: ["rivalry_id"]
          },
        ]
      }
      rosters: {
        Row: {
          class_year: string | null
          created_at: string | null
          games_on_roster: number | null
          games_played: number | null
          id: number
          is_starter: boolean | null
          jersey_number: string | null
          notes: string | null
          player_id: number
          position: string | null
          school_id: number
          season_id: number
          sport_id: string
          status: string | null
          team_season_id: number
          updated_at: string | null
        }
        Insert: {
          class_year?: string | null
          created_at?: string | null
          games_on_roster?: number | null
          games_played?: number | null
          id?: number
          is_starter?: boolean | null
          jersey_number?: string | null
          notes?: string | null
          player_id: number
          position?: string | null
          school_id: number
          season_id: number
          sport_id: string
          status?: string | null
          team_season_id: number
          updated_at?: string | null
        }
        Update: {
          class_year?: string | null
          created_at?: string | null
          games_on_roster?: number | null
          games_played?: number | null
          id?: number
          is_starter?: boolean | null
          jersey_number?: string | null
          notes?: string | null
          player_id?: number
          position?: string | null
          school_id?: number
          season_id?: number
          sport_id?: string
          status?: string | null
          team_season_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rosters_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rosters_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rosters_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rosters_team_season_id_fkey"
            columns: ["team_season_id"]
            isOneToOne: false
            referencedRelation: "team_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      school_pipeline_grades: {
        Row: {
          college_count: number | null
          grade: string | null
          id: number
          pro_count: number | null
          pro_rate: number | null
          school_id: number | null
          top_sport: string | null
          total_tracked: number | null
          updated_at: string | null
        }
        Insert: {
          college_count?: number | null
          grade?: string | null
          id?: number
          pro_count?: number | null
          pro_rate?: number | null
          school_id?: number | null
          top_sport?: string | null
          total_tracked?: number | null
          updated_at?: string | null
        }
        Update: {
          college_count?: number | null
          grade?: string | null
          id?: number
          pro_count?: number | null
          pro_rate?: number | null
          school_id?: number | null
          top_sport?: string | null
          total_tracked?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_pipeline_grades_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "school_pipeline_grades_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_pipeline_grades_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_pipeline_grades_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_pipeline_grades_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_pipeline_grades_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          aliases: string[] | null
          athletic_director: string | null
          athletic_director_email: string | null
          city: string | null
          closed_year: number | null
          colors: Json | null
          created_at: string | null
          deleted_at: string | null
          division: string | null
          enrollment: number | null
          founded_year: number | null
          id: number
          is_opponent_stub: boolean
          is_stub: boolean | null
          league_id: number | null
          logo_url: string | null
          mascot: string | null
          name: string
          phone: string | null
          piaa_class: string | null
          primary_color: string | null
          principal: string | null
          region_id: string | null
          school_type: string | null
          secondary_color: string | null
          short_name: string | null
          slug: string
          state: string | null
          updated_at: string | null
          v4_id: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          aliases?: string[] | null
          athletic_director?: string | null
          athletic_director_email?: string | null
          city?: string | null
          closed_year?: number | null
          colors?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          division?: string | null
          enrollment?: number | null
          founded_year?: number | null
          id?: number
          is_opponent_stub?: boolean
          is_stub?: boolean | null
          league_id?: number | null
          logo_url?: string | null
          mascot?: string | null
          name: string
          phone?: string | null
          piaa_class?: string | null
          primary_color?: string | null
          principal?: string | null
          region_id?: string | null
          school_type?: string | null
          secondary_color?: string | null
          short_name?: string | null
          slug: string
          state?: string | null
          updated_at?: string | null
          v4_id?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          aliases?: string[] | null
          athletic_director?: string | null
          athletic_director_email?: string | null
          city?: string | null
          closed_year?: number | null
          colors?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          division?: string | null
          enrollment?: number | null
          founded_year?: number | null
          id?: number
          is_opponent_stub?: boolean
          is_stub?: boolean | null
          league_id?: number | null
          logo_url?: string | null
          mascot?: string | null
          name?: string
          phone?: string | null
          piaa_class?: string | null
          primary_color?: string | null
          principal?: string | null
          region_id?: string | null
          school_type?: string | null
          secondary_color?: string | null
          short_name?: string | null
          slug?: string
          state?: string | null
          updated_at?: string | null
          v4_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "schools_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      search_index: {
        Row: {
          context: string | null
          display_name: string
          entity_id: number
          entity_type: string
          fts: unknown
          id: number
          popularity: number | null
          popularity_score: number | null
          region_id: string | null
          search_text: string
          sport_id: string | null
          updated_at: string | null
          url_path: string | null
        }
        Insert: {
          context?: string | null
          display_name: string
          entity_id: number
          entity_type: string
          fts?: unknown
          id?: number
          popularity?: number | null
          popularity_score?: number | null
          region_id?: string | null
          search_text: string
          sport_id?: string | null
          updated_at?: string | null
          url_path?: string | null
        }
        Update: {
          context?: string | null
          display_name?: string
          entity_id?: number
          entity_type?: string
          fts?: unknown
          id?: number
          popularity?: number | null
          popularity_score?: number | null
          region_id?: string | null
          search_text?: string
          sport_id?: string | null
          updated_at?: string | null
          url_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_index_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          id: number
          is_current: boolean | null
          label: string
          year_end: number
          year_start: number
        }
        Insert: {
          id?: number
          is_current?: boolean | null
          label: string
          year_end: number
          year_start: number
        }
        Update: {
          id?: number
          is_current?: boolean | null
          label?: string
          year_end?: number
          year_start?: number
        }
        Relationships: []
      }
      social_handles: {
        Row: {
          active: boolean
          created_at: string
          handle: string
          id: number
          last_fetched_at: string | null
          last_tweet_id: string | null
          platform: string
          player_name: string | null
          school_id: number | null
          school_name: string | null
          sport_id: string | null
          twitter_user_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          handle: string
          id?: number
          last_fetched_at?: string | null
          last_tweet_id?: string | null
          platform?: string
          player_name?: string | null
          school_id?: number | null
          school_name?: string | null
          sport_id?: string | null
          twitter_user_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          handle?: string
          id?: number
          last_fetched_at?: string | null
          last_tweet_id?: string | null
          platform?: string
          player_name?: string | null
          school_id?: number | null
          school_name?: string | null
          sport_id?: string | null
          twitter_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_handles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "social_handles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_handles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_handles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_handles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_handles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "social_handles_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      sports: {
        Row: {
          created_at: string | null
          emoji: string | null
          id: string
          is_major: boolean | null
          name: string
          slug: string | null
          sort_order: number | null
          stat_schema: Json | null
        }
        Insert: {
          created_at?: string | null
          emoji?: string | null
          id: string
          is_major?: boolean | null
          name: string
          slug?: string | null
          sort_order?: number | null
          stat_schema?: Json | null
        }
        Update: {
          created_at?: string | null
          emoji?: string | null
          id?: string
          is_major?: boolean | null
          name?: string
          slug?: string | null
          sort_order?: number | null
          stat_schema?: Json | null
        }
        Relationships: []
      }
      team_seasons: {
        Row: {
          coach_id: number | null
          created_at: string | null
          division: string | null
          id: number
          league_finish: string | null
          league_losses: number | null
          league_ties: number | null
          league_wins: number | null
          losses: number | null
          notes: string | null
          playoff_result: string | null
          points_against: number | null
          points_for: number | null
          ranking: number | null
          region_id: string | null
          school_id: number | null
          season_id: number | null
          source_file: string | null
          sport_id: string
          stats: Json | null
          ties: number | null
          updated_at: string | null
          win_pct: number | null
          wins: number | null
        }
        Insert: {
          coach_id?: number | null
          created_at?: string | null
          division?: string | null
          id?: number
          league_finish?: string | null
          league_losses?: number | null
          league_ties?: number | null
          league_wins?: number | null
          losses?: number | null
          notes?: string | null
          playoff_result?: string | null
          points_against?: number | null
          points_for?: number | null
          ranking?: number | null
          region_id?: string | null
          school_id?: number | null
          season_id?: number | null
          source_file?: string | null
          sport_id: string
          stats?: Json | null
          ties?: number | null
          updated_at?: string | null
          win_pct?: number | null
          wins?: number | null
        }
        Update: {
          coach_id?: number | null
          created_at?: string | null
          division?: string | null
          id?: number
          league_finish?: string | null
          league_losses?: number | null
          league_ties?: number | null
          league_wins?: number | null
          losses?: number | null
          notes?: string | null
          playoff_result?: string | null
          points_against?: number | null
          points_for?: number | null
          ranking?: number | null
          region_id?: string | null
          school_id?: number | null
          season_id?: number | null
          source_file?: string | null
          sport_id?: string
          stats?: Json | null
          ties?: number | null
          updated_at?: string | null
          win_pct?: number | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_seasons_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_seasons_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_seasons_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "team_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_seasons_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "team_seasons_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      transfers: {
        Row: {
          created_at: string | null
          from_school_id: number | null
          id: number
          player_id: number
          reason: string | null
          source_url: string | null
          sport_id: string | null
          to_school_id: number | null
          transfer_year: number
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          from_school_id?: number | null
          id?: number
          player_id: number
          reason?: string | null
          source_url?: string | null
          sport_id?: string | null
          to_school_id?: number | null
          transfer_year: number
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          from_school_id?: number | null
          id?: number
          player_id?: number
          reason?: string | null
          source_url?: string | null
          sport_id?: string | null
          to_school_id?: number | null
          transfer_year?: number
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "transfers_from_school_id_fkey"
            columns: ["from_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "transfers_from_school_id_fkey"
            columns: ["from_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_from_school_id_fkey"
            columns: ["from_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_from_school_id_fkey"
            columns: ["from_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_from_school_id_fkey"
            columns: ["from_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_from_school_id_fkey"
            columns: ["from_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "transfers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "transfers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "transfers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "transfers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_school_id_fkey"
            columns: ["to_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "transfers_to_school_id_fkey"
            columns: ["to_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_school_id_fkey"
            columns: ["to_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_school_id_fkey"
            columns: ["to_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_school_id_fkey"
            columns: ["to_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_to_school_id_fkey"
            columns: ["to_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_name: string
          badge_type: string
          earned_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          badge_name: string
          badge_type: string
          earned_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          badge_name?: string
          badge_type?: string
          earned_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          favorite_school_id: number | null
          favorite_sport_id: string | null
          id: string
          is_admin: boolean | null
          notification_prefs: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          favorite_school_id?: number | null
          favorite_sport_id?: string | null
          id: string
          is_admin?: boolean | null
          notification_prefs?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          favorite_school_id?: number | null
          favorite_sport_id?: string | null
          id?: string
          is_admin?: boolean | null
          notification_prefs?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_favorite_school_id_fkey"
            columns: ["favorite_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "user_profiles_favorite_school_id_fkey"
            columns: ["favorite_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_favorite_school_id_fkey"
            columns: ["favorite_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_favorite_school_id_fkey"
            columns: ["favorite_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_favorite_school_id_fkey"
            columns: ["favorite_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_favorite_school_id_fkey"
            columns: ["favorite_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "user_profiles_favorite_sport_id_fkey"
            columns: ["favorite_sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      weekend_recaps: {
        Row: {
          created_at: string | null
          game_date: string
          id: number
          player_id: number | null
          player_name: string
          result: string | null
          sport: string
          stat_line: string
          team: string | null
          week_label: string | null
        }
        Insert: {
          created_at?: string | null
          game_date: string
          id?: number
          player_id?: number | null
          player_name: string
          result?: string | null
          sport: string
          stat_line: string
          team?: string | null
          week_label?: string | null
        }
        Update: {
          created_at?: string | null
          game_date?: string
          id?: number
          player_id?: number | null
          player_name?: string
          result?: string | null
          sport?: string
          stat_line?: string
          team?: string | null
          week_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weekend_recaps_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "baseball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "weekend_recaps_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "weekend_recaps_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "football_career_leaders"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "weekend_recaps_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekend_recaps_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players_active"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      baseball_career_leaders: {
        Row: {
          career_batting_avg: number | null
          career_hits: number | null
          career_home_runs: number | null
          career_rbi: number | null
          career_runs: number | null
          career_stolen_bases: number | null
          career_strikeouts_pitching: number | null
          career_walks: number | null
          graduation_year: number | null
          name: string | null
          player_id: number | null
          school_name: string | null
          school_slug: string | null
          seasons_played: number | null
          slug: string | null
          total_games: number | null
        }
        Relationships: []
      }
      basketball_career_leaders: {
        Row: {
          career_assists: number | null
          career_blocks: number | null
          career_games: number | null
          career_points: number | null
          career_ppg: number | null
          career_rebounds: number | null
          career_steals: number | null
          career_three_pm: number | null
          college: string | null
          first_year: number | null
          graduation_year: number | null
          last_year: number | null
          league_slug: string | null
          player_id: number | null
          player_name: string | null
          player_slug: string | null
          pro_team: string | null
          school_id: number | null
          school_name: string | null
          school_slug: string | null
          seasons_played: number | null
        }
        Relationships: []
      }
      football_career_leaders: {
        Row: {
          career_interceptions: number | null
          career_pass_td: number | null
          career_pass_yards: number | null
          career_points: number | null
          career_rec_td: number | null
          career_rec_yards: number | null
          career_rush_td: number | null
          career_rush_yards: number | null
          career_sacks: number | null
          career_tackles: number | null
          career_total_td: number | null
          graduation_year: number | null
          name: string | null
          player_id: number | null
          school_name: string | null
          school_slug: string | null
          seasons_played: number | null
          slug: string | null
          total_games: number | null
        }
        Relationships: []
      }
      games_active: {
        Row: {
          away_school_id: number | null
          away_score: number | null
          created_at: string | null
          data_source: string | null
          game_date: string | null
          game_time: string | null
          game_type: string | null
          home_school_id: number | null
          home_score: number | null
          id: number | null
          last_verified_at: string | null
          league_id: number | null
          notes: string | null
          period_scores: Json | null
          play_by_play: Json | null
          playoff_round: string | null
          region_id: string | null
          season_id: number | null
          sport_id: string | null
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          away_school_id?: number | null
          away_score?: number | null
          created_at?: string | null
          data_source?: string | null
          game_date?: string | null
          game_time?: string | null
          game_type?: string | null
          home_school_id?: number | null
          home_score?: number | null
          id?: number | null
          last_verified_at?: string | null
          league_id?: number | null
          notes?: string | null
          period_scores?: Json | null
          play_by_play?: Json | null
          playoff_round?: string | null
          region_id?: string | null
          season_id?: number | null
          sport_id?: string | null
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          away_school_id?: number | null
          away_score?: number | null
          created_at?: string | null
          data_source?: string | null
          game_date?: string | null
          game_time?: string | null
          game_type?: string | null
          home_school_id?: number | null
          home_score?: number | null
          id?: number | null
          last_verified_at?: string | null
          league_id?: number | null
          notes?: string | null
          period_scores?: Json | null
          play_by_play?: Json | null
          playoff_round?: string | null
          region_id?: string | null
          season_id?: number | null
          sport_id?: string | null
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_games_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_away_school_id_fkey"
            columns: ["away_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_school_id_fkey"
            columns: ["home_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "games_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "games_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_dynasty_tracker: {
        Row: {
          championship_count: number | null
          decade: number | null
          league_titles: number | null
          school_colors: Json | null
          school_id: number | null
          school_name: string | null
          school_slug: string | null
          sport_id: string | null
          state_titles: number | null
        }
        Relationships: [
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "fk_championships_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_rivalry_tracker: {
        Row: {
          school_a_id: number | null
          school_a_name: string | null
          school_a_slug: string | null
          school_a_wins: number | null
          school_b_id: number | null
          school_b_name: string | null
          school_b_slug: string | null
          school_b_wins: number | null
          sport_id: string | null
          ties: number | null
          total_games: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_games_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      player_career_summary: {
        Row: {
          career_games: number | null
          career_stats: Json | null
          college: string | null
          first_year: number | null
          graduation_year: number | null
          last_year: number | null
          player_id: number | null
          player_name: string | null
          player_slug: string | null
          pro_draft_info: string | null
          pro_team: string | null
          school_id: number | null
          school_name: string | null
          school_slug: string | null
          seasons_played: number | null
          sport_id: string | null
        }
        Relationships: []
      }
      players_active: {
        Row: {
          bio: string | null
          college: string | null
          college_sport: string | null
          contact_email: string | null
          created_at: string | null
          deleted_at: string | null
          first_name: string | null
          graduation_year: number | null
          height: string | null
          hudl_profile_url: string | null
          id: number | null
          instagram_handle: string | null
          is_multi_sport: boolean | null
          is_verified: boolean | null
          last_name: string | null
          name: string | null
          photo_url: string | null
          positions: string[] | null
          primary_school_id: number | null
          pro_draft_info: string | null
          pro_team: string | null
          recruiting_status: string | null
          region_id: string | null
          slug: string | null
          twitter_handle: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          bio?: string | null
          college?: string | null
          college_sport?: string | null
          contact_email?: string | null
          created_at?: string | null
          deleted_at?: string | null
          first_name?: string | null
          graduation_year?: number | null
          height?: string | null
          hudl_profile_url?: string | null
          id?: number | null
          instagram_handle?: string | null
          is_multi_sport?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          name?: string | null
          photo_url?: string | null
          positions?: string[] | null
          primary_school_id?: number | null
          pro_draft_info?: string | null
          pro_team?: string | null
          recruiting_status?: string | null
          region_id?: string | null
          slug?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          bio?: string | null
          college?: string | null
          college_sport?: string | null
          contact_email?: string | null
          created_at?: string | null
          deleted_at?: string | null
          first_name?: string | null
          graduation_year?: number | null
          height?: string | null
          hudl_profile_url?: string | null
          id?: number | null
          instagram_handle?: string | null
          is_multi_sport?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          name?: string | null
          photo_url?: string | null
          positions?: string[] | null
          primary_school_id?: number | null
          pro_draft_info?: string | null
          pro_team?: string | null
          recruiting_status?: string | null
          region_id?: string | null
          slug?: string | null
          twitter_handle?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_primary_school_id_fkey"
            columns: ["primary_school_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "players_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      rivalry_records: {
        Row: {
          display_name: string | null
          first_meeting: string | null
          last_meeting: string | null
          rivalry_id: number | null
          rivalry_slug: string | null
          school_a_id: number | null
          school_a_logo: string | null
          school_a_name: string | null
          school_a_slug: string | null
          school_a_total_points: number | null
          school_a_wins: number | null
          school_b_id: number | null
          school_b_logo: string | null
          school_b_name: string | null
          school_b_slug: string | null
          school_b_total_points: number | null
          school_b_wins: number | null
          sport_id: string | null
          ties: number | null
          total_games: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_a_id_fkey"
            columns: ["school_a_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "basketball_career_leaders"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "school_directory_mv"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "school_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "schools_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rivalries_school_b_id_fkey"
            columns: ["school_b_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rivalries_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      school_directory_mv: {
        Row: {
          award_count: number | null
          championships_count: number | null
          city: string | null
          closed_year: number | null
          colors: Json | null
          id: number | null
          league_id: number | null
          league_name: string | null
          name: string | null
          player_count: number | null
          pro_count: number | null
          recent_championships: number | null
          slug: string | null
          state: string | null
          team_season_count: number | null
          total_losses: number | null
          total_wins: number | null
          win_pct: number | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["league_id"]
          },
        ]
      }
      school_names: {
        Row: {
          id: number | null
          league_id: number | null
          name: string | null
          slug: string | null
        }
        Insert: {
          id?: number | null
          league_id?: number | null
          name?: string | null
          slug?: string | null
        }
        Update: {
          id?: number | null
          league_id?: number | null
          name?: string | null
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["league_id"]
          },
        ]
      }
      schools_active: {
        Row: {
          address: string | null
          aliases: string[] | null
          athletic_director: string | null
          athletic_director_email: string | null
          city: string | null
          closed_year: number | null
          colors: Json | null
          created_at: string | null
          deleted_at: string | null
          division: string | null
          enrollment: number | null
          founded_year: number | null
          id: number | null
          is_opponent_stub: boolean | null
          is_stub: boolean | null
          league_id: number | null
          logo_url: string | null
          mascot: string | null
          name: string | null
          phone: string | null
          piaa_class: string | null
          primary_color: string | null
          principal: string | null
          region_id: string | null
          school_type: string | null
          secondary_color: string | null
          short_name: string | null
          slug: string | null
          state: string | null
          updated_at: string | null
          v4_id: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          aliases?: string[] | null
          athletic_director?: string | null
          athletic_director_email?: string | null
          city?: string | null
          closed_year?: number | null
          colors?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          division?: string | null
          enrollment?: number | null
          founded_year?: number | null
          id?: number | null
          is_opponent_stub?: boolean | null
          is_stub?: boolean | null
          league_id?: number | null
          logo_url?: string | null
          mascot?: string | null
          name?: string | null
          phone?: string | null
          piaa_class?: string | null
          primary_color?: string | null
          principal?: string | null
          region_id?: string | null
          school_type?: string | null
          secondary_color?: string | null
          short_name?: string | null
          slug?: string | null
          state?: string | null
          updated_at?: string | null
          v4_id?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          aliases?: string[] | null
          athletic_director?: string | null
          athletic_director_email?: string | null
          city?: string | null
          closed_year?: number | null
          colors?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          division?: string | null
          enrollment?: number | null
          founded_year?: number | null
          id?: number | null
          is_opponent_stub?: boolean | null
          is_stub?: boolean | null
          league_id?: number | null
          logo_url?: string | null
          mascot?: string | null
          name?: string | null
          phone?: string | null
          piaa_class?: string | null
          primary_color?: string | null
          principal?: string | null
          region_id?: string | null
          school_type?: string | null
          secondary_color?: string | null
          short_name?: string | null
          slug?: string | null
          state?: string | null
          updated_at?: string | null
          v4_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schools_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "team_alltime_records"
            referencedColumns: ["league_id"]
          },
          {
            foreignKeyName: "schools_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      season_leaderboards: {
        Row: {
          player_id: number | null
          player_name: string | null
          player_slug: string | null
          school_name: string | null
          school_slug: string | null
          season_id: number | null
          season_label: string | null
          sport_id: string | null
          stat_category: string | null
          stat_value: number | null
        }
        Relationships: []
      }
      team_alltime_records: {
        Row: {
          championship_count: number | null
          city: string | null
          first_year: number | null
          last_year: number | null
          league_id: number | null
          league_name: string | null
          league_short_name: string | null
          logo_url: string | null
          mascot: string | null
          pro_athlete_count: number | null
          school_id: number | null
          school_name: string | null
          school_short_name: string | null
          school_slug: string | null
          sport_id: string | null
          total_games: number | null
          total_losses: number | null
          total_points_against: number | null
          total_points_for: number | null
          total_seasons: number | null
          total_ties: number | null
          total_wins: number | null
          win_pct: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_seasons_sport"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cast_gotw_vote: {
        Args: { p_fingerprint: string; p_nominee_id: number }
        Returns: boolean
      }
      cast_potw_vote: {
        Args: { p_fingerprint: string; p_nominee_id: number }
        Returns: boolean
      }
      daitch_mokotoff: { Args: { "": string }; Returns: string[] }
      dmetaphone: { Args: { "": string }; Returns: string }
      dmetaphone_alt: { Args: { "": string }; Returns: string }
      get_all_city_awards: {
        Args: { p_sport_id: string }
        Returns: {
          award_id: number
          award_name: string
          award_position: string
          award_source: string
          award_type: string
          category: string
          player_id: number
          player_name: string
          player_slug: string
          school_id: number
          school_name: string
          school_slug: string
          season_label: string
          year_end: number
          year_start: number
        }[]
      }
      get_all_city_awards_json: { Args: { p_sport_id: string }; Returns: Json }
      get_career_leaders: {
        Args: {
          p_limit?: number
          p_order_dir?: string
          p_stat_column: string
          p_table_name: string
        }
        Returns: {
          player_id: number
          player_name: string
          player_slug: string
          school_id: number
          school_name: string
          school_slug: string
          stat_value: number
        }[]
      }
      get_rising_programs: {
        Args: { p_since_year?: number }
        Returns: {
          league_name: string
          recent_titles: number
          school_id: number
          school_name: string
          school_slug: string
        }[]
      }
      get_school_directory: {
        Args: never
        Returns: {
          award_count: number
          championship_count: number
          city: string
          closed_year: number
          colors: Json
          game_count: number
          has_baseball: boolean
          has_basketball: boolean
          has_football: boolean
          league_name: string
          player_count: number
          pro_count: number
          school_id: number
          school_name: string
          school_slug: string
          sport_count: number
          state: string
          total_losses: number
          total_wins: number
        }[]
      }
      get_school_names: {
        Args: { school_ids: number[] }
        Returns: {
          id: number
          league_id: number
          name: string
          slug: string
        }[]
      }
      get_school_team_stats: {
        Args: { p_sport_id: string }
        Returns: {
          championships: number
          city: string
          closed_year: number
          league_name: string
          school_id: number
          school_name: string
          school_slug: string
          season_count: number
          state: string
          total_losses: number
          total_ties: number
          total_wins: number
        }[]
      }
      get_season_leaders: {
        Args: {
          p_limit?: number
          p_min_games?: number
          p_order_dir?: string
          p_stat_column: string
          p_table_name: string
        }
        Returns: {
          player_id: number
          player_name: string
          player_slug: string
          school_id: number
          school_name: string
          school_slug: string
          season_label: string
          stat_value: number
          year_start: number
        }[]
      }
      get_similar_baseball_players: {
        Args: {
          result_limit?: number
          target_graduation_year: number
          target_player_id: number
          target_positions: string[]
          target_primary_stat: number
        }
        Returns: {
          college: string
          graduation_year: number
          id: number
          name: string
          positions: string[]
          primary_school_id: number
          primary_stat_value: number
          pro_draft_info: string
          pro_team: string
          school_name: string
          school_slug: string
          similarity_score: number
          slug: string
        }[]
      }
      get_similar_basketball_players: {
        Args: {
          result_limit?: number
          target_graduation_year: number
          target_player_id: number
          target_positions: string[]
          target_primary_stat: number
        }
        Returns: {
          college: string
          graduation_year: number
          id: number
          name: string
          positions: string[]
          primary_school_id: number
          primary_stat_value: number
          pro_draft_info: string
          pro_team: string
          school_name: string
          school_slug: string
          similarity_score: number
          slug: string
        }[]
      }
      get_similar_football_players: {
        Args: {
          result_limit?: number
          target_graduation_year: number
          target_player_id: number
          target_positions: string[]
          target_primary_stat: number
        }
        Returns: {
          college: string
          graduation_year: number
          id: number
          name: string
          positions: string[]
          primary_school_id: number
          primary_stat_value: number
          pro_draft_info: string
          pro_team: string
          school_name: string
          school_slug: string
          similarity_score: number
          slug: string
        }[]
      }
      get_top_rivalries: {
        Args: { p_limit?: number; p_sport_id: string }
        Returns: {
          latest_game_date: string
          latest_game_score: string
          school1_id: number
          school1_name: string
          school1_slug: string
          school1_wins: number
          school2_id: number
          school2_name: string
          school2_slug: string
          school2_wins: number
          ties: number
          total_games: number
        }[]
      }
      increment_gotw_votes: { Args: { nominee: string }; Returns: undefined }
      increment_reply_count: {
        Args: { target_post: string }
        Returns: undefined
      }
      map_epa_schedule: {
        Args: {
          p_opponents: string[]
          p_schedule?: Json
          p_school_id: number
          p_season_id: number
          p_year: number
        }
        Returns: Json
      }
      merge_player: {
        Args: { keep_id: number; remove_id: number }
        Returns: string
      }
      process_epa_file: {
        Args: { p_json: Json }
        Returns: {
          mapped: number
          school: string
          season: number
          staged: number
        }[]
      }
      process_epa_file_direct: {
        Args: { p_json: Json }
        Returns: {
          games_mapped: number
          rows_inserted: number
          school: string
        }[]
      }
      process_epa_football:
        | {
            Args: {
              p_game_ids: number[]
              p_interceptions: Json
              p_opponents: string[]
              p_passing: Json
              p_receiving: Json
              p_rushing: Json
              p_school_id: number
              p_scoring: Json
            }
            Returns: number
          }
        | {
            Args: {
              p_game_mapping: Json
              p_interceptions?: Json
              p_passing?: Json
              p_receiving?: Json
              p_rushing?: Json
              p_school_id: number
              p_scoring?: Json
              p_source_file: string
            }
            Returns: number
          }
      refresh_all_career_leaders: { Args: never; Returns: undefined }
      refresh_all_materialized_views: { Args: never; Returns: undefined }
      refresh_all_views: { Args: never; Returns: undefined }
      refresh_school_directory: { Args: never; Returns: undefined }
      restore_record: {
        Args: { p_id: number; p_table: string; p_user_id?: string }
        Returns: undefined
      }
      search_entities: {
        Args: {
          p_entity_type?: string
          p_limit?: number
          p_sport?: string
          query: string
        }
        Returns: {
          context: string
          display_name: string
          entity_id: number
          entity_type: string
          popularity: number
          popularity_score: number
          relevance: number
          sport_id: string
          url_path: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      soft_delete: {
        Args: { p_id: number; p_table: string; p_user_id?: string }
        Returns: undefined
      }
      soundex: { Args: { "": string }; Returns: string }
      text_soundex: { Args: { "": string }; Returns: string }
      update_social_handle_fetch: {
        Args: {
          p_handle_id: number
          p_last_tweet_id?: string
          p_twitter_user_id?: string
        }
        Returns: undefined
      }
      upsert_social_post: {
        Args: {
          p_platform: string
          p_player_name?: string
          p_post_url: string
          p_school_name?: string
          p_source_handle: string
          p_sport_id?: string
          p_tweet_id: string
        }
        Returns: undefined
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
    Enums: {},
  },
} as const
