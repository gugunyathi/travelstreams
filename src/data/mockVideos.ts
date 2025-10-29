import { VideoContent, VideoCategory } from "@/types/video";

// Fallback videos in case API is not available
export const fallbackVideos: VideoContent[] = [
  {
    id: "1",
    location: {
      id: "bali",
      name: "Bali",
      country: "Indonesia",
      coordinates: { lat: -8.3405, lng: 115.0920 }
    },
    creator: {
      id: "creator1",
      username: "@bali_explorer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      xpPoints: 15420,
      totalEarnings: 2340.50
    },
    videoUrl: "/placeholder.mp4",
    thumbnailUrl: "/placeholder.svg",
    duration: 3,
    views: 125000,
    likes: 8900,
    viralityScore: 87,
    token: {
      symbol: "BALI",
      price: 1.02,
      change24h: -5.5,
      volume: 158800,
      holders: 5000,
      marketCap: 5100000
    },
    bettingPool: 47400,
    createdAt: new Date(),
    paidToPost: 0.10,
    categories: ['culture', 'nature', 'fun'],
    streamTags: ['Bali', 'Indonesia', 'Beach'],
    xpEarned: 204
  },
  {
    id: "2",
    location: {
      id: "paris",
      name: "Paris",
      country: "France",
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    creator: {
      id: "creator2",
      username: "@paris_vibes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
      xpPoints: 12300,
      totalEarnings: 1890.25
    },
    videoUrl: "/placeholder.mp4",
    thumbnailUrl: "/placeholder.svg",
    duration: 3.5,
    views: 98000,
    likes: 7200,
    viralityScore: 82,
    token: {
      symbol: "PARIS",
      price: 2.15,
      change24h: 8.2,
      volume: 234000,
      holders: 8900,
      marketCap: 19135000
    },
    bettingPool: 38200,
    createdAt: new Date(),
    paidToPost: 0.15,
    categories: ['culture', 'food', 'shopping'],
    streamTags: ['Paris', 'France', 'Europe'],
    xpEarned: 187
  },
  {
    id: "3",
    location: {
      id: "tokyo",
      name: "Tokyo",
      country: "Japan",
      coordinates: { lat: 35.6762, lng: 139.6503 }
    },
    creator: {
      id: "creator3",
      username: "@tokyo_nights",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
      xpPoints: 22100,
      totalEarnings: 4567.80
    },
    videoUrl: "/placeholder.mp4",
    thumbnailUrl: "/placeholder.svg",
    duration: 3,
    views: 340000,
    likes: 23400,
    viralityScore: 94,
    token: {
      symbol: "TOKYO",
      price: 1.25,
      change24h: 67.8,
      volume: 425000,
      holders: 3400,
      marketCap: 4250000
    },
    bettingPool: 45000,
    createdAt: new Date(),
    paidToPost: 0.10,
    categories: ['culture', 'nightlife', 'shopping'],
    streamTags: ['Tokyo', 'Japan', 'Asia'],
    xpEarned: 890
  },
  {
    id: "4",
    location: {
      id: "dubai",
      name: "Dubai",
      country: "UAE",
      coordinates: { lat: 25.2048, lng: 55.2708 }
    },
    creator: {
      id: "creator4",
      username: "@dubai_luxury",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
      xpPoints: 12800,
      totalEarnings: 1890.40
    },
    videoUrl: "/placeholder.mp4",
    thumbnailUrl: "/placeholder.svg",
    duration: 3.5,
    views: 89000,
    likes: 5670,
    viralityScore: 72,
    token: {
      symbol: "DUBAI",
      price: 1.82,
      change24h: 15.3,
      volume: 312000,
      holders: 6700,
      marketCap: 12194000
    },
    bettingPool: 28900,
    createdAt: new Date(),
    paidToPost: 0.10,
    categories: ['shopping', 'fun', 'adventure'],
    streamTags: ['Dubai', 'UAE', 'Luxury'],
    xpEarned: 320
  },
  {
    id: "5",
    location: {
      id: "newyork",
      name: "New York",
      country: "USA",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    creator: {
      id: "creator5",
      username: "@nyc_explorer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe",
      xpPoints: 18900,
      totalEarnings: 3210.90
    },
    videoUrl: "/placeholder.mp4",
    thumbnailUrl: "/placeholder.svg",
    duration: 3,
    views: 210000,
    likes: 14500,
    viralityScore: 88,
    token: {
      symbol: "NYC",
      price: 2.89,
      change24h: 34.2,
      volume: 587000,
      holders: 12100,
      marketCap: 34969000
    },
    bettingPool: 61000,
    createdAt: new Date(),
    paidToPost: 0.10,
    categories: ['adventure', 'shopping', 'culture'],
    streamTags: ['NYC', 'USA', 'NewYork'],
    xpEarned: 720
  },
  {
    id: "6",
    location: {
      id: "vegas",
      name: "Las Vegas",
      country: "USA",
      coordinates: { lat: 36.1699, lng: -115.1398 }
    },
    creator: {
      id: "creator6",
      username: "@vegas_nights",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      xpPoints: 9800,
      totalEarnings: 1450.20
    },
    videoUrl: "/placeholder.mp4",
    thumbnailUrl: "/placeholder.svg",
    duration: 3.5,
    views: 167000,
    likes: 12230,
    viralityScore: 85,
    token: {
      symbol: "VEGAS",
      price: 1.78,
      change24h: 22.4,
      volume: 412000,
      holders: 8670,
      marketCap: 15430600
    },
    bettingPool: 56700,
    createdAt: new Date(),
    paidToPost: 0.10,
    categories: ['nightlife', 'fun', 'shopping'],
    streamTags: ['Vegas', 'USA', 'Nightlife'],
    xpEarned: 680
  }
];

// Export for backward compatibility - defaults to fallback videos
// Use useVideos hook for dynamic API loading
export const mockVideos: VideoContent[] = fallbackVideos;