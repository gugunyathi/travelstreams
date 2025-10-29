# 🚀 Supabase Migration Complete!

Your TravelStreamz application has been successfully migrated from MongoDB to Supabase! This guide will help you complete the setup.

## ✅ What's Been Migrated

- ✅ **Database Schema**: Created PostgreSQL tables to replace MongoDB collections
- ✅ **File Storage**: Replaced MongoDB GridFS with Supabase Storage
- ✅ **API Endpoints**: Updated all API routes to use Supabase
- ✅ **Frontend Services**: Updated video service and hooks
- ✅ **Scripts**: Updated upload and database check scripts
- ✅ **Type Definitions**: Updated TypeScript types for new schema

## 🔧 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (usually 1-2 minutes)

### 2. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the SQL script from `supabase-schema.sql`:

```sql
-- Create videos table to replace MongoDB videos collection
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  location_id TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  creator TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration DECIMAL NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  categories TEXT[] DEFAULT '{}',
  token JSONB,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_location_id ON videos(location_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Create Storage Bucket

1. In your Supabase dashboard, go to **Storage**
2. Create a new bucket called `videos`
3. Set it to **Public** (for video streaming)

### 4. Configure Environment Variables

Update your `.env` file with your Supabase credentials:

```env
# Get these from your Supabase project settings
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Keep your existing WalletConnect and RPC settings
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

**Where to find your Supabase credentials:**
- Go to your project **Settings** → **API**
- **Project URL** = `VITE_SUPABASE_URL`
- **anon public** key = `VITE_SUPABASE_ANON_KEY`
- **service_role secret** key = `SUPABASE_SERVICE_ROLE_KEY`

### 5. Upload Your Videos

Run the upload script to transfer your videos to Supabase:

```bash
npm run upload
```

This will:
- Upload all `*_tiny.mp4` files from the `public` folder to Supabase Storage
- Create database records with metadata for each video
- Organize files by location in the storage bucket

### 6. Test the Migration

1. **Check Database:**
   ```bash
   node scripts/checkDatabase.mjs
   ```

2. **Start API Server:**
   ```bash
   npm run api
   ```

3. **Start Frontend:**
   ```bash
   npm run dev
   ```

4. **Test Full Application:**
   ```bash
   npm run dev:all
   ```

## 📊 New Database Schema

### Videos Table Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `video_id` | TEXT | Unique video identifier |
| `filename` | TEXT | Original filename |
| `storage_path` | TEXT | Path in Supabase Storage |
| `location_id` | TEXT | Location identifier (bali, paris, etc.) |
| `coordinates` | JSONB | Lat/lng coordinates |
| `creator` | TEXT | Creator username |
| `title` | TEXT | Video title |
| `description` | TEXT | Video description |
| `duration` | DECIMAL | Video duration in seconds |
| `views` | INTEGER | View count |
| `likes` | INTEGER | Like count |
| `shares` | INTEGER | Share count |
| `comments` | INTEGER | Comment count |
| `categories` | TEXT[] | Array of categories |
| `token` | JSONB | Token information |
| `thumbnail_url` | TEXT | Thumbnail image URL |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

## 🔄 API Changes

### Updated Endpoints

All endpoints now use Supabase instead of MongoDB:

- `GET /api/videos` - Fetch all videos from Supabase
- `GET /api/videos/location/:locationId` - Fetch videos by location
- `GET /api/videos/stream/:videoId` - Stream video from Supabase Storage

### Video Streaming

Videos are now streamed from Supabase Storage with:
- ✅ Range request support for progressive loading
- ✅ Proper caching headers
- ✅ Error handling and fallbacks

## 🎯 Benefits of Supabase Migration

### Performance
- **Faster Queries**: PostgreSQL with proper indexing
- **Better Caching**: Built-in CDN for file storage
- **Optimized Storage**: Dedicated file storage system

### Scalability
- **Auto-scaling**: Handles traffic spikes automatically
- **Global CDN**: Files served from edge locations
- **Connection Pooling**: Efficient database connections

### Developer Experience
- **Real-time**: Built-in real-time subscriptions
- **Dashboard**: Visual database and storage management
- **Backup**: Automatic daily backups
- **Monitoring**: Built-in analytics and logging

### Cost Efficiency
- **Free Tier**: 500MB database + 1GB storage
- **Pay-as-you-scale**: Only pay for what you use
- **No Infrastructure**: Fully managed service

## 🛠 Available Scripts

```bash
# Upload videos to Supabase
npm run upload

# Check database status
node scripts/checkDatabase.mjs

# Start API server
npm run api

# Start frontend
npm run dev

# Start both API and frontend
npm run dev:all

# Test API endpoints
node scripts/testApi.mjs
```

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid supabaseUrl" Error**
   - Check that `VITE_SUPABASE_URL` is set correctly
   - Ensure URL starts with `https://`

2. **"Invalid API key" Error**
   - Verify `VITE_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`
   - Check keys are copied correctly from Supabase dashboard

3. **Videos Not Loading**
   - Ensure storage bucket `videos` is created and public
   - Check that videos were uploaded successfully
   - Verify API server is running on port 3001

4. **Database Connection Failed**
   - Check your Supabase project is active
   - Verify environment variables are set
   - Ensure your IP is not blocked (Supabase allows all by default)

### Getting Help

- Check the Supabase dashboard for error logs
- Use the browser developer tools to inspect network requests
- Run `node scripts/checkDatabase.mjs` to verify setup

## 🎉 Migration Complete!

Your TravelStreamz app is now powered by Supabase! You have:

- ✅ Modern PostgreSQL database
- ✅ Scalable file storage with CDN
- ✅ Real-time capabilities (ready for future features)
- ✅ Professional infrastructure
- ✅ Better performance and reliability

The migration maintains all existing functionality while providing a more robust and scalable foundation for your application.