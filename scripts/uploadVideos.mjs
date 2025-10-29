import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set FFmpeg and FFprobe paths
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   VITE_SUPABASE_URL or SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Location mapping for videos
const LOCATIONS = [
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    coordinates: { lat: -8.3405, lng: 115.0920 },
    token: { symbol: 'BALI', price: 1.02, change24h: -5.5, volume: 158800, holders: 5000, marketCap: 5100000 }
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    token: { symbol: 'PARIS', price: 2.15, change24h: 8.2, volume: 234000, holders: 8900, marketCap: 19135000 }
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    token: { symbol: 'TOKYO', price: 1.25, change24h: 67.8, volume: 425000, holders: 3400, marketCap: 4250000 }
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    token: { symbol: 'DUBAI', price: 1.82, change24h: 15.3, volume: 312000, holders: 6700, marketCap: 12194000 }
  },
  {
    id: 'newyork',
    name: 'New York',
    country: 'USA',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    token: { symbol: 'NYC', price: 2.89, change24h: 34.2, volume: 587000, holders: 12100, marketCap: 34969000 }
  },
  {
    id: 'vegas',
    name: 'Las Vegas',
    country: 'USA',
    coordinates: { lat: 36.1699, lng: -115.1398 },
    token: { symbol: 'VEGAS', price: 1.78, change24h: 22.4, volume: 412000, holders: 8670, marketCap: 15430600 }
  }
];

const CATEGORIES = ['culture', 'nature', 'fun', 'food', 'shopping', 'nightlife', 'adventure'];
const CREATORS = [
  { id: 'creator1', username: '@travel_explorer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', xpPoints: 15420, totalEarnings: 2340.50 },
  { id: 'creator2', username: '@world_vibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', xpPoints: 12300, totalEarnings: 1890.25 },
  { id: 'creator3', username: '@city_nights', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper', xpPoints: 22100, totalEarnings: 4567.80 },
  { id: 'creator4', username: '@luxury_travel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna', xpPoints: 12800, totalEarnings: 1890.40 },
  { id: 'creator5', username: '@globe_explorer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe', xpPoints: 18900, totalEarnings: 3210.90 },
  { id: 'creator6', username: '@destination_vibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', xpPoints: 9800, totalEarnings: 1450.20 }
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateVideoMetadata(filename, locationIndex, actualDuration = 3) {
  const location = LOCATIONS[locationIndex % LOCATIONS.length];
  const creator = getRandomElement(CREATORS);
  const categories = getRandomElements(CATEGORIES, Math.floor(Math.random() * 3) + 1);
  const videoId = filename.replace('_tiny.mp4', '');
  
  return {
    video_id: videoId,
    filename,
    storage_path: `${location.id}/${filename}`,
    location_id: location.id,
    location_name: location.name,
    country: location.country,
    coordinates: location.coordinates,
    creator: {
      id: creator.id,
      username: creator.username,
      avatar: creator.avatar,
      xpPoints: creator.xpPoints,
      totalEarnings: creator.totalEarnings
    },
    thumbnail_url: `https://picsum.photos/400/600?random=${Math.floor(Math.random() * 1000)}`,
    duration: Math.round(actualDuration * 100) / 100,
    views: Math.floor(Math.random() * 50000) + 1000,
    likes: Math.floor(Math.random() * 5000) + 100,
    virality_score: Math.round((Math.random() * 10) * 100) / 100,
    token: location.token,
    betting_pool: Math.round((Math.random() * 1000) * 100) / 100,
    paid_to_post: Math.round((Math.random() * 100) * 100) / 100,
    categories,
    stream_tags: [location.id, location.country.toLowerCase(), ...categories],
    xp_earned: Math.floor(Math.random() * 100) + 10
  };
}

async function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.warn(`Could not get duration for ${filePath}, using default 3s`);
        resolve(3);
      } else {
        resolve(metadata.format.duration || 3);
      }
    });
  });
}

async function uploadVideosToSupabase() {
  try {
    console.log('🚀 Starting Supabase video upload...\n');
    
    // Test Supabase connection
    console.log('Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('videos')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError);
      return;
    }
    
    console.log('✅ Connected to Supabase successfully!\n');
    
    // Clear existing data
    console.log('Clearing existing data...');
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (deleteError) {
      console.error('❌ Error clearing existing data:', deleteError);
      return;
    }
    
    // Clear storage bucket
    const { data: existingFiles } = await supabase.storage
      .from('videos')
      .list();
    
    if (existingFiles && existingFiles.length > 0) {
      const filePaths = existingFiles.map(file => file.name);
      await supabase.storage
        .from('videos')
        .remove(filePaths);
    }
    
    console.log('✅ Existing data cleared.\n');
    
    // Get all video files from public folder
    const publicPath = path.join(__dirname, '..', 'public');
    const files = fs.readdirSync(publicPath).filter(file => file.endsWith('_tiny.mp4'));
    
    console.log(`📁 Found ${files.length} video files to upload\n`);
    
    let uploadedCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      const filePath = path.join(publicPath, filename);
      
      console.log(`📤 Uploading ${i + 1}/${files.length}: ${filename}`);
      
      try {
        // Read file
        const fileBuffer = fs.readFileSync(filePath);
        
        // Get actual video duration
        const duration = await getVideoDuration(filePath);
        const fileSizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(2);
        
        console.log(`   Duration: ${duration.toFixed(2)}s, Size: ${fileSizeMB}MB`);
        
        // Generate metadata with actual duration
        const metadata = generateVideoMetadata(filename, i, duration);
        
        // Use the storage path from metadata
        const storagePath = metadata.storage_path;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('videos')
          .upload(storagePath, fileBuffer, {
            contentType: 'video/mp4',
            upsert: true
          });
        
        if (uploadError) {
          console.error(`   ❌ Storage upload failed:`, uploadError);
          continue;
        }
        
        // Save video metadata to database
        const { error: dbError } = await supabase
          .from('videos')
          .insert(metadata);
        
        if (dbError) {
          console.error(`   ❌ Database insert failed:`, dbError);
          continue;
        }
        
        uploadedCount++;
        console.log(`   ✅ Uploaded successfully (Video ID: ${metadata.video_id})\n`);
        
      } catch (error) {
        console.error(`   ❌ Error uploading ${filename}:`, error.message, '\n');
      }
    }
    
    console.log(`🎉 Upload complete! ${uploadedCount}/${files.length} videos uploaded successfully.\n`);
    
    // Verify upload
    const { count, error: countError } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`📊 Total videos in database: ${count}`);
    }
    
    console.log('\n✅ Migration to Supabase completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the upload
uploadVideosToSupabase();
