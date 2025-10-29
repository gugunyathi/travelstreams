import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const API_URL = process.env.API_URL || 'https://travelstreamz.vercel.app';

let cachedSupabase = null;

async function getSupabaseClient() {
  if (cachedSupabase) {
    return cachedSupabase;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in environment variables');
  }

  cachedSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  return cachedSupabase;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = await getSupabaseClient();
  
  // Parse the URL path
  const path = req.url.replace('/api', '');

  // Health check endpoint
  if (path === '/health') {
    try {
      const { error } = await supabase.from('videos').select('count').limit(1);
      return res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        supabase: error ? 'disconnected' : 'connected'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        supabase: 'disconnected',
        error: error.message
      });
    }
  }

  // Get all videos
  if (path === '/videos' && req.method === 'GET') {
    try {
      console.log('📥 GET /api/videos - Fetching all videos');
      const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const videosWithUrls = videos?.map(video => ({
        id: video.video_id,
        videoUrl: `${API_URL}/api/videos/stream/${video.id}`,
        location: {
          id: video.location_id,
          name: video.location_name,
          country: video.country,
          coordinates: video.coordinates
        },
        creator: video.creator,
        thumbnailUrl: video.thumbnail_url,
        duration: video.duration,
        views: video.views,
        likes: video.likes,
        viralityScore: video.virality_score,
        token: video.token,
        bettingPool: video.betting_pool,
        paidToPost: video.paid_to_post,
        categories: video.categories,
        streamTags: video.stream_tags,
        xpEarned: video.xp_earned,
        createdAt: video.created_at,
        updatedAt: video.updated_at
      })) || [];

      res.setHeader('Cache-Control', 'public, max-age=300');
      return res.json(videosWithUrls);
    } catch (error) {
      console.error('❌ Error fetching videos:', error);
      return res.status(500).json({
        error: 'Failed to fetch videos',
        message: error.message
      });
    }
  }

  // Get videos by location
  if (path.startsWith('/videos/location/') && req.method === 'GET') {
    try {
      const locationId = path.split('/videos/location/')[1];
      const { data: videos, error } = await supabase
        .from('videos')
        .select('*')
        .eq('location_id', locationId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const videosWithUrls = videos?.map(video => ({
        id: video.video_id,
        videoUrl: `${API_URL}/api/videos/stream/${video.id}`,
        location: {
          id: video.location_id,
          name: video.location_name,
          country: video.country,
          coordinates: video.coordinates
        },
        creator: video.creator,
        thumbnailUrl: video.thumbnail_url,
        duration: video.duration,
        views: video.views,
        likes: video.likes,
        viralityScore: video.virality_score,
        token: video.token,
        bettingPool: video.betting_pool,
        paidToPost: video.paid_to_post,
        categories: video.categories,
        streamTags: video.stream_tags,
        xpEarned: video.xp_earned,
        createdAt: video.created_at,
        updatedAt: video.updated_at
      })) || [];

      return res.json(videosWithUrls);
    } catch (error) {
      console.error('Error fetching videos by location:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch videos',
        message: error.message
      });
    }
  }

  // Stream video
  if (path.startsWith('/videos/stream/') && req.method === 'GET') {
    try {
      const videoId = path.split('/videos/stream/')[1];

      // Get video info from database
      const { data: video, error: dbError } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single();

      if (dbError || !video) {
        console.error(`❌ Video not found in database: ${videoId}`, dbError);
        return res.status(404).json({ error: 'Video not found' });
      }

      // Get video file from Supabase Storage
      const { data: fileData, error: storageError } = await supabase.storage
        .from('videos')
        .download(video.storage_path);

      if (storageError || !fileData) {
        console.error(`❌ Video file not found in storage: ${video.storage_path}`, storageError);
        return res.status(404).json({ error: 'Video file not found' });
      }

      // Convert blob to buffer for streaming
      const buffer = Buffer.from(await fileData.arrayBuffer());
      const fileSize = buffer.length;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        const chunk = buffer.slice(start, end + 1);

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4',
          'Cache-Control': 'public, max-age=31536000, immutable'
        });

        res.end(chunk);
      } else {
        res.writeHead(200, {
          'Content-Type': 'video/mp4',
          'Content-Length': fileSize,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable'
        });

        res.end(buffer);
      }
    } catch (error) {
      console.error('Error streaming video:', error);
      if (!res.headersSent) {
        return res.status(500).json({
          error: 'Failed to stream video',
          message: error.message
        });
      }
    }
  } else {
    return res.status(404).json({ error: 'Not found' });
  }
}
