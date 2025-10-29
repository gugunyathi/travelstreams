import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;
const API_URL = process.env.API_URL || `http://localhost:${PORT}`;

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase configuration');
  console.error('Required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key for server-side operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Enable compression for all responses
app.use(compression({
  level: 6, // Balance between speed and compression
  threshold: 1024 // Only compress responses larger than 1KB
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Range'],
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  console.log('🏥 Health check requested');
  
  try {
    // Test Supabase connection by querying the videos table
    const { error } = await supabase.from('videos').select('count').limit(1);
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      supabase: error ? 'disconnected' : 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      supabase: 'disconnected',
      uptime: process.uptime(),
      error: error.message
    });
  }
});

// Initialize Supabase connection
async function initializeSupabase() {
  try {
    console.log('🔌 Initializing Supabase connection...');
    console.log('📍 URL:', SUPABASE_URL);
    
    // Test the connection by querying the videos table
    const { data, error, count } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Connected to Supabase successfully');
    console.log('📦 Database: Supabase');
    console.log('🎬 Storage Bucket: videos');
    console.log(`📹 Videos in table: ${count || 0}`);
    
  } catch (error) {
    console.error('❌ Supabase connection error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check if VITE_SUPABASE_URL is set in .env file');
    console.error('2. Check if SUPABASE_SERVICE_ROLE_KEY is set in .env file');
    console.error('3. Verify Supabase project is active');
    console.error('4. Ensure videos table exists in Supabase');
    process.exit(1);
  }
}

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    console.log('📥 GET /api/videos - Fetching all videos');
    const startTime = Date.now();
    
    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ Found ${videos?.length || 0} videos in ${Date.now() - startTime}ms`);
    
    const videosWithUrls = videos?.map(video => ({
      id: video.id,
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
    
    // Add caching headers for video list
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json(videosWithUrls);
    
    console.log(`📤 Sent ${videosWithUrls.length} videos to client`);
  } catch (error) {
    console.error('❌ Error fetching videos:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    res.status(500).json({ 
      error: 'Failed to fetch videos',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get videos by location
app.get('/api/videos/location/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;
    console.log(`📥 GET /api/videos/location/${locationId} - Fetching videos by location`);
    
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
    
    console.log(`✅ Found ${videosWithUrls.length} videos for location ${locationId}`);
    res.json(videosWithUrls);
  } catch (error) {
    console.error('❌ Error fetching videos by location:', error);
    res.status(500).json({ 
      error: 'Failed to fetch videos',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Stream video with range support (for seeking and progressive loading)
app.get('/api/videos/stream/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    console.log(`🎬 Streaming video: ${videoId}`);
    
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
    
    console.log(`✅ Found video: ${video.filename}`);
    
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
    
    console.log(`📁 File size: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);
    
    // Support range requests for progressive loading
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      
      console.log(`📦 Range request: ${start}-${end}/${fileSize} (${(chunkSize / 1024).toFixed(1)}KB)`);
      
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
      console.log(`📦 Full file request: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);
      
      res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable'
      });
      
      res.end(buffer);
    }
  } catch (error) {
    console.error('❌ Error streaming video:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to stream video',
        message: error.message 
      });
    }
  }
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting API server...');
    console.log('📍 Port:', PORT);
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    
    await initializeSupabase();
    
    const server = app.listen(PORT, () => {
      console.log('✅ API server running successfully');
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`🔗 Videos endpoint: http://localhost:${PORT}/api/videos`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log('⏳ Waiting for requests...\n');
    });
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'EADDRINUSE') {
        console.error(`\n💡 Port ${PORT} is already in use.`);
        console.error('Solutions:');
        console.error(`1. Kill the process using port ${PORT}`);
        console.error('2. Use a different port in .env file');
        console.error('3. Run: lsof -ti:${PORT} | xargs kill -9');
      }
      
      process.exit(1);
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
      });
      console.log('✅ Supabase connection closed');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    process.exit(1);
  }
}

startServer();
