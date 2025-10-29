import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

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

async function checkDatabase() {
  try {
    console.log('🔍 Checking Supabase Database...\n');
    
    // Test connection and get video count
    const { count: videoCount, error: countError } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error connecting to Supabase:', countError);
      return;
    }
    
    console.log(`📊 Total videos in database: ${videoCount}\n`);
    
    // Get first 10 videos with details
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(10);
    
    if (videosError) {
      console.error('❌ Error fetching videos:', videosError);
      return;
    }
    
    console.log('📹 Sample Videos (First 10):');
    console.log('='.repeat(80));
    
    videos.forEach((video, index) => {
      console.log(`\n${index + 1}. ${video.location_id} (${video.filename})`);
      console.log(`   Title: ${video.title}`);
      console.log(`   Duration: ${video.duration.toFixed(2)}s`);
      console.log(`   Storage Path: ${video.storage_path}`);
      console.log(`   Views: ${video.views.toLocaleString()}`);
      console.log(`   Likes: ${video.likes.toLocaleString()}`);
      console.log(`   Created: ${video.created_at}`);
    });
    
    // Check storage bucket
    console.log('\n\n📦 Supabase Storage Files:');
    console.log('='.repeat(80));
    
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('videos')
      .list('', { limit: 100, sortBy: { column: 'name', order: 'asc' } });
    
    if (storageError) {
      console.error('❌ Error fetching storage files:', storageError);
    } else {
      let totalSize = 0;
      let fileCount = 0;
      
      // List files in each location folder
      const locations = ['bali', 'paris', 'tokyo', 'dubai', 'newyork', 'vegas'];
      
      for (const location of locations) {
        const { data: locationFiles, error: locationError } = await supabase.storage
          .from('videos')
          .list(location);
        
        if (!locationError && locationFiles) {
          locationFiles.forEach((file, index) => {
            if (file.name.endsWith('.mp4')) {
              const sizeMB = (file.metadata?.size / (1024 * 1024)).toFixed(2) || 'Unknown';
              totalSize += file.metadata?.size || 0;
              fileCount++;
              console.log(`${fileCount}. ${location}/${file.name}`);
              console.log(`   Size: ${sizeMB}MB`);
              console.log(`   Updated: ${file.updated_at}`);
            }
          });
        }
      }
      
      const totalStorageMB = (totalSize / (1024 * 1024)).toFixed(2);
      
      console.log('\n\n📈 Summary:');
      console.log('='.repeat(80));
      console.log(`Total videos in database: ${videoCount}`);
      console.log(`Total files in storage: ${fileCount}`);
      console.log(`Total storage: ${totalStorageMB}MB`);
      
      if (videoCount > 0) {
        console.log(`Average size: ${(totalSize / videoCount / (1024 * 1024)).toFixed(2)}MB per video`);
      }
    }
    
    // Get all videos for duration analysis
    const { data: allVideos, error: allVideosError } = await supabase
      .from('videos')
      .select('duration');
    
    if (!allVideosError && allVideos) {
      const durationsUnder4 = allVideos.filter(v => v.duration <= 4).length;
      const durationsExactly3 = allVideos.filter(v => Math.abs(v.duration - 3) < 0.1).length;
      
      console.log(`\n✅ Videos with duration ≤ 4s: ${durationsUnder4}/${videoCount} (${((durationsUnder4/videoCount)*100).toFixed(1)}%)`);
      console.log(`✅ Videos with duration ≈ 3s: ${durationsExactly3}/${videoCount} (${((durationsExactly3/videoCount)*100).toFixed(1)}%)`);
      
      if (durationsExactly3 === videoCount) {
        console.log('\n🎉 SUCCESS! All videos are optimized to 3 seconds!');
      } else {
        console.log('\n⚠️  Some videos may not be fully optimized.');
      }
    }
    
    // Check locations distribution
    const { data: locationStats, error: locationError } = await supabase
      .from('videos')
      .select('location_id');
    
    if (!locationError && locationStats) {
      const locationCounts = {};
      locationStats.forEach(video => {
        locationCounts[video.location_id] = (locationCounts[video.location_id] || 0) + 1;
      });
      
      console.log('\n\n🌍 Videos by Location:');
      console.log('='.repeat(80));
      Object.entries(locationCounts).forEach(([location, count]) => {
        console.log(`${location}: ${count} videos`);
      });
    }
    
    console.log('\n✅ Database check completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabase();
