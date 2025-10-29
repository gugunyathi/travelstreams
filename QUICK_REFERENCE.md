# 🎬 TravelStreamz API - Quick Reference

## 🚀 Start Application
```bash
npm run dev:all
```
- **Frontend**: http://localhost:8081
- **API**: http://localhost:3001

---

## 📡 API Endpoints

### 1. Get All Videos
```bash
GET http://localhost:3001/api/videos
```
Returns 46 videos with full metadata

### 2. Get Videos by Location
```bash
GET http://localhost:3001/api/videos/location/{locationId}
```
Locations: `bali`, `paris`, `tokyo`, `dubai`, `newyork`, `vegas`

### 3. Stream Video
```bash
GET http://localhost:3001/api/videos/stream/{fileId}
```
Returns MP4 video stream

---

## ⚛️ React Hooks

### Fetch All Videos
```typescript
import { useVideos } from '@/hooks/useVideos';

const { videos, loading, error } = useVideos();
```

### Fetch Videos by Location
```typescript
import { useVideosByLocation } from '@/hooks/useVideos';

const { videos, loading, error } = useVideosByLocation('bali');
```

### Direct API Call
```typescript
import { videoApi } from '@/hooks/useVideos';

const videos = await videoApi.getAllVideos();
const baliVideos = await videoApi.getVideosByLocation('bali');
const streamUrl = videoApi.getVideoStreamUrl(fileId);
```

---

## 🗄️ Database

- **Database**: `travelstreamz`
- **Collection**: `videos` (metadata)
- **GridFS Bucket**: `videos` (video files)
- **Total Videos**: 46
- **Total Size**: ~450MB

---

## 📂 Project Structure

```
travelstreamz/
├── server/
│   └── api.mjs              # Express API server
├── scripts/
│   └── uploadVideos.mjs     # Upload script
├── src/
│   ├── hooks/
│   │   └── useVideos.ts     # React hooks for API
│   ├── data/
│   │   └── mockVideos.ts    # Fallback videos
│   └── components/
│       └── VideoFeed.tsx    # Main video component
├── .env                     # Environment variables
└── package.json             # NPM scripts
```

---

## 🔧 NPM Scripts

```bash
npm run dev       # Start Vite only
npm run api       # Start API server only
npm run dev:all   # Start both servers
npm run upload    # Upload videos to MongoDB
npm run build     # Build for production
```

---

## 🐛 Troubleshooting

### Videos Not Loading?
1. Check both servers are running: `npm run dev:all`
2. Open http://localhost:3001/api/videos
3. Should return JSON array

### API Connection Error?
1. Verify MongoDB URI in `.env`
2. Check internet connection
3. Run `npm run upload` to ensure videos exist

### Port Already in Use?
- Vite will auto-switch to next available port
- Check terminal for actual port number

---

## ✅ Success Indicators

### Terminal
```
[1] Connected to MongoDB
[1] API server running on http://localhost:3001
[0] VITE v5.4.19  ready in 721 ms
[0] ➜  Local:   http://localhost:8081/
```

### Browser Console
```
✅ Loaded 46 videos from MongoDB
```

### App Behavior
- Shows "Loading..." briefly
- Then displays video feed
- Auto-scrolls every 3-3.5 seconds
- Navigation buttons work

---

## 📚 Documentation

- **API_INTEGRATION.md** - Complete API guide
- **API_COMPLETE.md** - Implementation summary
- **MONGODB_SETUP.md** - Database setup
- **README.md** - Project overview

---

## 🎯 Key Features

✅ Self-hosted videos (no 404 errors)  
✅ GridFS streaming  
✅ React hooks integration  
✅ Fallback system  
✅ Loading & error states  
✅ 6 global locations  
✅ Rich metadata  
✅ Token integration  

---

**🎉 Everything is working! Enjoy your travel video feed!**
