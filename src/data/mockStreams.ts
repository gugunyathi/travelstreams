import { Stream, StreamTag, VideoContent, Creator } from "@/types/video";

// Mock creators
const creators: Creator[] = [
  {
    id: "creator1",
    username: "bali_explorer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bali",
    xpPoints: 15420,
    totalEarnings: 2340.50
  },
  {
    id: "creator2",
    username: "vegas_nights",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vegas",
    xpPoints: 22100,
    totalEarnings: 4567.80
  },
  {
    id: "creator3",
    username: "tokyo_vibes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tokyo",
    xpPoints: 18900,
    totalEarnings: 3210.90
  },
  {
    id: "creator4",
    username: "safari_pro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=safari",
    xpPoints: 12300,
    totalEarnings: 1890.40
  },
  {
    id: "creator5",
    username: "miami_heat",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=miami",
    xpPoints: 19800,
    totalEarnings: 3890.20
  },
];

// Stream tags
export const streamTags: StreamTag[] = [
  {
    id: "tag1",
    name: "Bali",
    displayName: "#Bali",
    color: "#10b981",
    videoCount: 156,
    totalXP: 45600,
    topCreators: [creators[0], creators[2]]
  },
  {
    id: "tag2",
    name: "Vegas",
    displayName: "#Vegas",
    color: "#f59e0b",
    videoCount: 203,
    totalXP: 67800,
    topCreators: [creators[1], creators[4]]
  },
  {
    id: "tag3",
    name: "Tokyo",
    displayName: "#Tokyo",
    color: "#ec4899",
    videoCount: 189,
    totalXP: 54300,
    topCreators: [creators[2], creators[0]]
  },
  {
    id: "tag4",
    name: "Safari",
    displayName: "#Safari",
    color: "#8b5cf6",
    videoCount: 98,
    totalXP: 32100,
    topCreators: [creators[3], creators[1]]
  },
  {
    id: "tag5",
    name: "Miami",
    displayName: "#Miami",
    color: "#ef4444",
    videoCount: 167,
    totalXP: 48900,
    topCreators: [creators[4], creators[0]]
  },
  {
    id: "tag6",
    name: "Paris",
    displayName: "#Paris",
    color: "#6366f1",
    videoCount: 142,
    totalXP: 41200,
    topCreators: [creators[1], creators[3]]
  },
];

// Generate mock videos for each stream
const generateVideosForTag = (tag: StreamTag, count: number): VideoContent[] => {
  const videos: VideoContent[] = [];
  
  for (let i = 0; i < count; i++) {
    const creator = creators[Math.floor(Math.random() * creators.length)];
    videos.push({
      id: `${tag.name.toLowerCase()}-video-${i}`,
      location: {
        id: `loc-${i}`,
        name: tag.name,
        country: getCountryForTag(tag.name),
        coordinates: { lat: 0, lng: 0 }
      },
      creator,
      videoUrl: `https://example.com/video-${i}.mp4`,
      thumbnailUrl: `https://picsum.photos/seed/${tag.name}${i}/400/600`,
      duration: 15 + Math.floor(Math.random() * 45), // 15-60 seconds
      views: Math.floor(Math.random() * 100000),
      likes: Math.floor(Math.random() * 10000),
      viralityScore: Math.random() * 100,
      token: {
        symbol: tag.name.toUpperCase().slice(0, 4),
        price: parseFloat((Math.random() * 10).toFixed(2)),
        change24h: parseFloat((Math.random() * 20 - 10).toFixed(2)),
        volume: Math.floor(Math.random() * 1000000),
        holders: Math.floor(Math.random() * 10000),
        marketCap: Math.floor(Math.random() * 10000000)
      },
      bettingPool: Math.floor(Math.random() * 50000),
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      paidToPost: 0.10,
      categories: getRandomCategories(),
      streamTags: [tag.name, ...getRandomExtraTags()],
      xpEarned: Math.floor(Math.random() * 1000),
      embedUrl: getEmbedUrlForTag(tag.name, i)
    });
  }
  
  return videos;
};

const getCountryForTag = (tagName: string): string => {
  const countryMap: { [key: string]: string } = {
    'Bali': 'Indonesia',
    'Vegas': 'USA',
    'Tokyo': 'Japan',
    'Safari': 'Kenya',
    'Miami': 'USA',
    'Paris': 'France'
  };
  return countryMap[tagName] || 'Unknown';
};

const getRandomCategories = () => {
  const categories = ['safety', 'fun', 'shopping', 'food', 'culture', 'nightlife', 'adventure', 'nature'];
  const count = 1 + Math.floor(Math.random() * 3);
  return categories.sort(() => Math.random() - 0.5).slice(0, count) as any[];
};

const getRandomExtraTags = (): string[] => {
  const tags = ['Beach', 'City', 'Food', 'Nightlife', 'Adventure', 'Luxury', 'Budget', 'Culture'];
  const count = Math.floor(Math.random() * 3);
  return tags.sort(() => Math.random() - 0.5).slice(0, count);
};

const getEmbedUrlForTag = (tagName: string, index: number): string => {
  // Mock embed URLs - in production these would be real video embeds
  return `https://www.youtube.com/embed/dQw4w9WgXcQ?start=${index * 10}`;
};

// Create streams
export const mockStreams: Stream[] = streamTags.map((tag, index) => ({
  id: `stream-${tag.id}`,
  tag,
  videos: generateVideosForTag(tag, 15 + Math.floor(Math.random() * 10)), // 15-25 videos per stream
  currentVideoIndex: 0,
  totalViews: Math.floor(Math.random() * 1000000),
  activeViewers: Math.floor(Math.random() * 5000),
  xpPool: tag.totalXP
}));

// Helper function to get stream by tag name
export const getStreamByTag = (tagName: string): Stream | undefined => {
  return mockStreams.find(stream => stream.tag.name === tagName);
};

// Helper function to get next video in stream
export const getNextVideoInStream = (stream: Stream): VideoContent | null => {
  if (!stream.videos.length) return null;
  const nextIndex = (stream.currentVideoIndex + 1) % stream.videos.length;
  return stream.videos[nextIndex];
};
