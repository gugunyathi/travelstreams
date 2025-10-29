-- TravelStreamz Supabase Database Schema
-- This replaces the MongoDB collections with PostgreSQL tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create videos table to replace MongoDB videos collection
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id VARCHAR(255) UNIQUE NOT NULL,
  filename VARCHAR(255) NOT NULL,
  storage_path VARCHAR(500) NOT NULL, -- Path in Supabase Storage
  location_id VARCHAR(100) NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  coordinates JSONB NOT NULL, -- {lat: number, lng: number}
  creator JSONB NOT NULL, -- {id, username, avatar, xpPoints, totalEarnings}
  thumbnail_url TEXT,
  duration DECIMAL(10,2) NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  virality_score DECIMAL(5,2) DEFAULT 0,
  token JSONB NOT NULL, -- {symbol, price, change24h, volume, holders, marketCap}
  betting_pool DECIMAL(15,2) DEFAULT 0,
  paid_to_post DECIMAL(15,2) DEFAULT 0,
  categories TEXT[] DEFAULT '{}',
  stream_tags TEXT[] DEFAULT '{}',
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_videos_location_id ON videos(location_id);
CREATE INDEX idx_videos_video_id ON videos(video_id);
CREATE INDEX idx_videos_created_at ON videos(created_at);
CREATE INDEX idx_videos_views ON videos(views);
CREATE INDEX idx_videos_virality_score ON videos(virality_score);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_videos_updated_at 
    BEFORE UPDATE ON videos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for videos (run this in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Create storage policies for videos bucket
-- These policies allow public read access and authenticated upload/update/delete
-- You'll need to run these in the Supabase dashboard SQL editor:

/*
-- Allow public read access to videos
CREATE POLICY "Public read access for videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Allow authenticated users to update videos
CREATE POLICY "Authenticated users can update videos" ON storage.objects
FOR UPDATE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete videos
CREATE POLICY "Authenticated users can delete videos" ON storage.objects
FOR DELETE USING (bucket_id = 'videos' AND auth.role() = 'authenticated');
*/

-- Sample data structure (for reference)
/*
INSERT INTO videos (
  video_id, filename, storage_path, location_id, location_name, country,
  coordinates, creator, duration, views, likes, virality_score,
  token, betting_pool, paid_to_post, categories, stream_tags, xp_earned
) VALUES (
  'sample_video_1',
  'sample_video.mp4',
  'videos/sample_video.mp4',
  'bali',
  'Bali',
  'Indonesia',
  '{"lat": -8.3405, "lng": 115.0920}',
  '{"id": "creator_1", "username": "TravelVlogger", "avatar": "https://example.com/avatar.jpg", "xpPoints": 1500, "totalEarnings": 250.50}',
  30.5,
  1250,
  89,
  8.7,
  '{"symbol": "BALI", "price": 0.045, "change24h": 12.5, "volume": 125000, "holders": 850, "marketCap": 450000}',
  150.75,
  25.00,
  ARRAY['travel', 'adventure'],
  ARRAY['bali', 'indonesia', 'beach'],
  50
);
*/