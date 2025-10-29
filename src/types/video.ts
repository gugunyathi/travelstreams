export interface Location {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TokenMetrics {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  holders: number;
  marketCap: number;
}

export type VideoCategory = 'safety' | 'fun' | 'shopping' | 'food' | 'culture' | 'nightlife' | 'adventure' | 'nature';

export interface Creator {
  id: string;
  username: string;
  avatar: string;
  xpPoints: number;
  totalEarnings: number;
}

export interface StreamTag {
  id: string;
  name: string; // e.g., "Bali", "Vegas", "Tokyo"
  displayName: string; // e.g., "#Bali", "#Vegas"
  color: string;
  videoCount: number;
  totalXP: number;
  topCreators: Creator[];
}

export interface VideoContent {
  id: string;
  location: Location;
  creator: Creator;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: number;
  viralityScore: number;
  token: TokenMetrics;
  bettingPool: number;
  createdAt: Date;
  paidToPost: number;
  categories: VideoCategory[];
  embedUrl?: string;
  streamTags: string[]; // Array of tag names like ["Bali", "Beach", "Sunset"]
  xpEarned: number;
  isAutoPlaying?: boolean;
}

export interface Stream {
  id: string;
  tag: StreamTag;
  videos: VideoContent[];
  currentVideoIndex: number;
  totalViews: number;
  activeViewers: number;
  xpPool: number;
}

export type ViewMode = 'single' | 'split-2' | 'split-3';

export interface ViewerState {
  mode: ViewMode;
  activeStreams: Stream[];
  bets: {
    streamId: string;
    amount: number;
    prediction: 'viral' | 'winner';
  }[];
}
