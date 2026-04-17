import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database row types
export interface VideoRow {
  id: string;
  video_id: string;
  video_url: string;
  location_id: string;
  location_name: string;
  country: string;
  lat: number;
  lng: number;
  creator_id: string;
  creator_username: string;
  creator_avatar: string;
  creator_xp_points: number;
  creator_total_earnings: number;
  thumbnail_url: string | null;
  duration: number;
  views: number;
  likes: number;
  virality_score: number;
  token_symbol: string;
  token_price: number;
  token_change_24h: number;
  token_volume: number;
  token_holders: number;
  token_market_cap: number;
  betting_pool: number;
  paid_to_post: number;
  categories: string[];
  stream_tags: string[];
  xp_earned: number;
  is_system_video: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoLikeRow {
  id: string;
  video_id: string;
  user_address: string;
  created_at: string;
}

export interface BetRow {
  id: string;
  video_id: string;
  user_address: string;
  amount: number;
  prediction: 'viral' | 'winner';
  status: 'pending' | 'won' | 'lost';
  tx_hash: string | null;
  created_at: string;
}

export interface VideoSubmissionRow {
  id: string;
  embed_url: string;
  location: string;
  country: string | null;
  categories: string[];
  stream_tags: string[];
  submitter_address: string | null;
  status: 'pending' | 'approved' | 'rejected';
  paid_amount: number;
  tx_hash: string | null;
  created_at: string;
}

export interface StreamTagRow {
  id: string;
  tag_id: string;
  name: string;
  display_name: string;
  color: string;
  video_count: number;
  total_xp: number;
  created_at: string;
}
