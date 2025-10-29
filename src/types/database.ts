// Supabase database types for TravelStreamz

export interface VideoDocument {
  id?: string; // UUID primary key
  video_id: string;
  filename: string;
  storage_path: string; // Path in Supabase Storage
  location_id: string;
  location_name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  creator: {
    id: string;
    username: string;
    avatar: string;
    xpPoints: number;
    totalEarnings: number;
  };
  thumbnail_url?: string;
  duration: number;
  views: number;
  likes: number;
  virality_score: number;
  token: {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
    holders: number;
    marketCap: number;
  };
  betting_pool: number;
  paid_to_post: number;
  categories: string[];
  stream_tags: string[];
  xp_earned: number;
  created_at: Date;
  updated_at: Date;
}

export interface VideoResponse {
  id: string;
  videoUrl: string;
  location: {
    id: string;
    name: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  creator: {
    id: string;
    username: string;
    avatar: string;
    xpPoints: number;
    totalEarnings: number;
  };
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: number;
  viralityScore: number;
  token: {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
    holders: number;
    marketCap: number;
  };
  bettingPool: number;
  paidToPost: number;
  categories: string[];
  streamTags: string[];
  xpEarned: number;
  createdAt: Date;
  updatedAt: Date;
}
