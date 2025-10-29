# MongoDB Video Storage Setup

## Overview
This app now uses MongoDB with GridFS to store and stream video content. All 46 videos from the public folder have been uploaded to the database.

## Architecture

### Database Structure
- **Database**: `travelstreamz`
- **Collection**: `videos` (stores video metadata)
- **GridFS Bucket**: `videos` (stores actual video files)

### Components

1. **MongoDB Connection** (`src/lib/mongodb.ts`)
   - Handles database connection
   - Provides GridFS bucket access

2. **Video Service** (`src/services/videoService.ts`)
   - Business logic for video operations
   - Transforms database documents to API responses

3. **API Server** (`server/api.mjs`)
   - Express server on port 3001
   - Endpoints:
     - `GET /api/videos` - Get all videos
     - `GET /api/videos/location/:locationId` - Get videos by location
     - `GET /api/videos/stream/:fileId` - Stream video file

4. **Upload Script** (`scripts/uploadVideos.mjs`)
   - Migrates videos from public folder to MongoDB
   - Generates metadata for each video
   - Distributes videos across 6 locations

## Environment Variables

Required in `.env`:
```
VITE_MONGODB_URI=mongodb+srv://basevibecoders_db_user:00Bh7MFd0oCNSvPb@cluster0.el7at0x.mongodb.net/
MONGODB_URI=mongodb+srv://basevibecoders_db_user:00Bh7MFd0oCNSvPb@cluster0.el7at0x.mongodb.net/
```

## Running the App

### Development (Both Servers)
```bash
npm run dev:all
```
This runs:
- Vite dev server on `http://localhost:8080`
- API server on `http://localhost:3001`

### Individual Servers
```bash
npm run dev   # Vite only
npm run api   # API server only
```

### Upload Videos to Database
```bash
npm run upload
```

## Video Data

### Current Status
- ✅ 46 videos uploaded to MongoDB
- ✅ Videos distributed across 6 locations:
  - Bali, Indonesia
  - Paris, France
  - Tokyo, Japan
  - Dubai, UAE
  - New York, USA
  - Las Vegas, USA

### Video Metadata
Each video includes:
- Location information (name, country, coordinates)
- Creator details (username, avatar, XP, earnings)
- Video stats (views, likes, virality score)
- Token information (symbol, price, volume, market cap)
- Betting pool data
- Categories and tags
- XP earned

## API Endpoints

### Get All Videos
```
GET http://localhost:3001/api/videos
```
Returns array of all videos with streaming URLs.

### Get Videos by Location
```
GET http://localhost:3001/api/videos/location/bali
```
Returns videos for specific location (bali, paris, tokyo, dubai, newyork, vegas).

### Stream Video
```
GET http://localhost:3001/api/videos/stream/{gridfsFileId}
```
Streams video file directly from GridFS.

## Data Flow

1. User loads app → `mockVideos.ts` fetches from API
2. API queries MongoDB `videos` collection
3. Videos returned with streaming URLs
4. When video plays, browser requests stream endpoint
5. API retrieves file from GridFS and streams to browser

## Fallback Mechanism

If API is unavailable, the app falls back to the original 6 Pexels videos defined in `mockVideos.ts`.

## Benefits

✅ **No External Dependencies**: Videos hosted in our database
✅ **No 404 Errors**: All videos under our control
✅ **Scalable**: Can add unlimited videos
✅ **Fast Streaming**: GridFS optimized for large files
✅ **Rich Metadata**: Each video has complete travel/gaming context
✅ **Distributed Content**: Videos across 6 global locations

## Maintenance

### Re-upload Videos
If you need to re-upload all videos:
```bash
npm run upload
```
This will clear existing data and re-upload all MP4 files from the public folder.

### Add New Videos
1. Add MP4 files to `public/` folder (preferably ending in `_tiny.mp4`)
2. Run `npm run upload`
3. Restart servers: `npm run dev:all`

## Troubleshooting

### Videos Not Loading
1. Ensure both servers are running: `npm run dev:all`
2. Check API server is accessible: `http://localhost:3001/api/videos`
3. Verify MongoDB connection in `.env`

### Upload Failed
1. Check MongoDB URI is correct
2. Verify network connection
3. Ensure public folder has video files

### CORS Errors
API server includes CORS headers for local development. For production, update CORS settings in `server/api.mjs`.
