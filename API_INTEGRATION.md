# 🎥 Video API Integration Guide

## ✅ API Setup Complete!

Your TravelStreamz app now has a fully functional API to fetch and display videos from MongoDB!

## 🚀 Quick Start

### Start the Application
```bash
npm run dev:all
```

This command runs:
- **Frontend (Vite)**: http://localhost:8081
- **API Server**: http://localhost:3001

### Verify Videos are Loading
Open http://localhost:8081 in your browser. You should see:
1. "Loading videos from database..." (briefly)
2. Then 46 videos loading from MongoDB
3. Check browser console for: `✅ Loaded 46 videos from MongoDB`

---

## 📡 API Endpoints

### 1. Get All Videos
```
GET http://localhost:3001/api/videos
```

**Response**: Array of all 46 videos with metadata
```json
[
  {
    "id": "bali_1729785600_abc123",
    "videoUrl": "http://localhost:3001/api/videos/stream/68fb965f53735a73a921fb77",
    "location": {
      "id": "bali",
      "name": "Bali",
      "country": "Indonesia",
      "coordinates": { "lat": -8.3405, "lng": 115.0920 }
    },
    "creator": {
      "id": "creator1",
      "username": "@travel_explorer",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      "xpPoints": 15420,
      "totalEarnings": 2340.50
    },
    "duration": 3.2,
    "views": 125000,
    "likes": 8900,
    "viralityScore": 87,
    "token": {
      "symbol": "BALI",
      "price": 1.02,
      "change24h": -5.5,
      "volume": 158800,
      "holders": 5000,
      "marketCap": 5100000
    },
    "bettingPool": 47400,
    "categories": ["culture", "nature", "fun"],
    "streamTags": ["Bali", "Indonesia"],
    "xpEarned": 204
  }
]
```

### 2. Get Videos by Location
```
GET http://localhost:3001/api/videos/location/:locationId
```

**Locations**: `bali`, `paris`, `tokyo`, `dubai`, `newyork`, `vegas`

**Example**:
```bash
curl http://localhost:3001/api/videos/location/bali
```

### 3. Stream Video File
```
GET http://localhost:3001/api/videos/stream/:fileId
```

**Example**:
```bash
curl http://localhost:3001/api/videos/stream/68fb965f53735a73a921fb77 --output video.mp4
```

This endpoint streams the actual MP4 video file from MongoDB GridFS.

---

## 🎯 React Integration

### Using the `useVideos` Hook

The app now uses a custom React hook to fetch videos dynamically:

```typescript
import { useVideos } from '@/hooks/useVideos';

function MyComponent() {
  const { videos, loading, error } = useVideos();

  if (loading) return <div>Loading videos...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
```

### Using the `useVideosByLocation` Hook

Filter videos by specific location:

```typescript
import { useVideosByLocation } from '@/hooks/useVideos';

function LocationVideos() {
  const { videos, loading, error } = useVideosByLocation('bali');

  return (
    <div>
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
```

### Direct API Calls

For more control, use the `videoApi` object:

```typescript
import { videoApi } from '@/hooks/useVideos';

async function fetchVideos() {
  try {
    const videos = await videoApi.getAllVideos();
    console.log('Fetched videos:', videos);
  } catch (error) {
    console.error('Failed to fetch videos:', error);
  }
}

// Get stream URL for a video
const streamUrl = videoApi.getVideoStreamUrl('68fb965f53735a73a921fb77');
```

---

## 🔄 How It Works

### 1. Component Mounts
When `VideoFeed` component loads, it calls `useVideos()`:

```typescript
const { videos, loading, error } = useVideos();
```

### 2. Hook Fetches from API
The hook makes a fetch request to:
```
http://localhost:3001/api/videos
```

### 3. API Queries MongoDB
The Express server:
1. Connects to MongoDB Atlas
2. Queries the `videos` collection
3. Maps GridFS file IDs to streaming URLs
4. Returns JSON response

### 4. Videos Display in App
React receives the videos and renders them in the feed with:
- Auto-scroll functionality
- Keyboard/touch/wheel navigation
- Location filtering
- Category filtering

### 5. Video Streaming
When a video plays, the browser requests:
```
http://localhost:3001/api/videos/stream/{fileId}
```

The API:
1. Opens a GridFS download stream
2. Pipes the video file to the response
3. Browser plays the MP4 directly

---

## 🛡️ Fallback System

If the API is unavailable, the app automatically falls back to 6 hardcoded Pexels videos:

```typescript
// In useVideos hook
catch (err) {
  console.error('Error fetching videos:', err);
  setError(err.message);
  
  // Load fallback videos
  const { fallbackVideos } = await import('@/data/mockVideos');
  setVideos(fallbackVideos);
  console.log('⚠️ Using fallback videos');
}
```

The user sees:
- Warning: "⚠️ API Connection Issue"
- Error message
- "Using fallback videos (6 available)"
- "Retry Connection" button

---

## 📊 Video Distribution

The 46 videos are distributed across 6 locations:

| Location | Videos | Token Symbol |
|----------|--------|--------------|
| Bali, Indonesia | ~8 | $BALI |
| Paris, France | ~7 | $PARIS |
| Tokyo, Japan | ~8 | $TOKYO |
| Dubai, UAE | ~8 | $DUBAI |
| New York, USA | ~8 | $NYC |
| Las Vegas, USA | ~7 | $VEGAS |

---

## 🎬 Video Metadata

Each video includes:

### Location Info
- ID, name, country, coordinates

### Creator Info
- Username, avatar, XP points, total earnings

### Video Stats
- Views, likes, virality score, duration

### Token Info
- Symbol, price, 24h change, volume, holders, market cap

### Gaming Info
- Betting pool amount, XP earned, paid to post

### Content Tags
- Categories (culture, nature, fun, etc.)
- Stream tags (location-specific)

---

## 🐛 Debugging

### Check API is Running
```bash
curl http://localhost:3001/api/videos
```

Should return JSON array of videos.

### Check Video Count
Open browser console when app loads:
```
✅ Loaded 46 videos from MongoDB
```

### Check for Errors
If you see:
```
⚠️ Using fallback videos
```

Then:
1. Verify API server is running on port 3001
2. Check MongoDB connection string in `.env`
3. Ensure videos were uploaded: `npm run upload`

### Test Video Streaming
Visit:
```
http://localhost:3001/api/videos/stream/68fb965f53735a73a921fb77
```

Should play/download a video file.

---

## 🚀 Production Deployment

### Update API URLs
In `src/hooks/useVideos.ts`, change:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

To:
```typescript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';
```

### Add to `.env`
```
VITE_API_URL=https://your-api-domain.com/api
```

### Deploy API Server
Deploy `server/api.mjs` to:
- Heroku
- Railway
- Vercel (serverless functions)
- AWS Lambda
- Google Cloud Run

### Update CORS Settings
In `server/api.mjs`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

---

## ✅ Success Indicators

When everything works:

1. **Terminal Output**:
   ```
   [1] Connected to MongoDB
   [1] API server running on http://localhost:3001
   [0] VITE v5.4.19  ready in 721 ms
   [0] ➜  Local:   http://localhost:8081/
   ```

2. **Browser Console**:
   ```
   ✅ Loaded 46 videos from MongoDB
   ```

3. **Video Feed**:
   - Shows "Loading videos from database..." briefly
   - Then displays videos with auto-scroll
   - Navigation buttons work
   - Progress bar animates

4. **Network Tab**:
   - See request to `http://localhost:3001/api/videos`
   - Status: 200 OK
   - Response: JSON array of 46 videos

---

## 🎉 You're All Set!

Your TravelStreamz app is now:
- ✅ Fetching videos from MongoDB
- ✅ Streaming videos via GridFS
- ✅ Displaying 46 real travel videos
- ✅ Auto-scrolling through content
- ✅ Filtering by location and categories
- ✅ Showing rich metadata (tokens, creators, stats)

**Open http://localhost:8081 and enjoy your travel video feed!** 🌍✈️
