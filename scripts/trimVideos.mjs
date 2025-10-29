import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set FFmpeg and FFprobe paths
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

const publicPath = path.join(__dirname, '..', 'public');
const tempPath = path.join(__dirname, '..', 'temp_trimmed');

// Create temp directory if it doesn't exist
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}

/**
 * Trim video to 3 seconds and compress
 * @param {string} inputPath - Input video path
 * @param {string} outputPath - Output video path
 * @returns {Promise<{size: number, duration: number}>} - File info
 */
async function trimAndCompressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`  Processing: ${path.basename(inputPath)}`);
    
    const startTime = Date.now();
    
    ffmpeg(inputPath)
      // Trim to 3 seconds
      .setStartTime(0)
      .setDuration(3)
      
      // Set resolution to 720p (optimal for mobile)
      .size('720x?')
      
      // Video settings
      .videoBitrate('1500k')  // 1.5 Mbps - good quality
      .videoCodec('libx264')
      .fps(30)  // 30fps for smooth playback
      
      // Audio settings
      .audioBitrate('128k')
      .audioCodec('aac')
      .audioChannels(2)
      
      // Output format
      .outputFormat('mp4')
      
      // Optimization flags
      .outputOptions([
        '-preset fast',              // Fast encoding
        '-movflags +faststart',      // Enable progressive streaming
        '-pix_fmt yuv420p',          // Maximum compatibility
        '-profile:v baseline',       // H.264 baseline profile
        '-level 3.0',                // H.264 level 3.0
        '-crf 23'                    // Quality (23 = good quality/size balance)
      ])
      
      // Progress callback
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\r  Progress: ${Math.round(progress.percent)}%`);
        }
      })
      
      // Success callback
      .on('end', () => {
        const stats = fs.statSync(outputPath);
        const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        console.log(`\n  ✓ Complete in ${processingTime}s - Size: ${fileSizeMB}MB`);
        
        resolve({
          size: stats.size,
          duration: 3
        });
      })
      
      // Error callback
      .on('error', (err) => {
        console.log(`\n  ✗ Error: ${err.message}`);
        reject(err);
      })
      
      // Save to output
      .save(outputPath);
  });
}

/**
 * Get video duration using FFprobe
 * @param {string} filePath - Video file path
 * @returns {Promise<number>} - Duration in seconds
 */
async function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
}

/**
 * Main function to process all videos
 */
async function processAllVideos() {
  console.log('🎬 TravelStreamz Video Trimmer\n');
  console.log('======================================\n');
  
  // Get all video files
  const files = fs.readdirSync(publicPath).filter(file => file.endsWith('_tiny.mp4'));
  
  if (files.length === 0) {
    console.log('❌ No videos found in public folder');
    return;
  }
  
  console.log(`📹 Found ${files.length} videos to process\n`);
  
  let processedCount = 0;
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const inputPath = path.join(publicPath, filename);
    const outputPath = path.join(tempPath, filename.replace('_tiny.mp4', '_3s.mp4'));
    
    console.log(`\n[${i + 1}/${files.length}] ${filename}`);
    
    try {
      // Get original file info
      const originalStats = fs.statSync(inputPath);
      const originalDuration = await getVideoDuration(inputPath);
      
      console.log(`  Original: ${(originalStats.size / (1024 * 1024)).toFixed(2)}MB, ${originalDuration.toFixed(2)}s`);
      
      // Skip if already 3 seconds or less
      if (originalDuration <= 3.1) {
        console.log(`  ⏭️  Skipping - Already 3 seconds or less`);
        
        // Just copy and compress
        await trimAndCompressVideo(inputPath, outputPath);
        
        const newStats = fs.statSync(outputPath);
        
        totalOriginalSize += originalStats.size;
        totalNewSize += newStats.size;
        processedCount++;
        
        results.push({
          filename,
          originalSize: originalStats.size,
          newSize: newStats.size,
          originalDuration,
          newDuration: originalDuration,
          savings: originalStats.size - newStats.size
        });
        
        continue;
      }
      
      // Trim and compress
      const result = await trimAndCompressVideo(inputPath, outputPath);
      
      const newStats = fs.statSync(outputPath);
      
      totalOriginalSize += originalStats.size;
      totalNewSize += newStats.size;
      processedCount++;
      
      results.push({
        filename,
        originalSize: originalStats.size,
        newSize: newStats.size,
        originalDuration,
        newDuration: 3,
        savings: originalStats.size - newStats.size
      });
      
    } catch (error) {
      console.log(`  ✗ Failed: ${error.message}`);
    }
  }
  
  // Summary
  console.log('\n\n======================================');
  console.log('📊 PROCESSING SUMMARY');
  console.log('======================================\n');
  
  console.log(`✅ Processed: ${processedCount}/${files.length} videos`);
  console.log(`📦 Original total size: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`📦 New total size: ${(totalNewSize / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`💾 Total savings: ${((totalOriginalSize - totalNewSize) / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`📉 Reduction: ${((1 - totalNewSize / totalOriginalSize) * 100).toFixed(1)}%`);
  
  // Top 5 biggest savings
  console.log('\n🏆 Top 5 Biggest Savings:');
  const topSavings = results
    .sort((a, b) => b.savings - a.savings)
    .slice(0, 5);
  
  topSavings.forEach((result, index) => {
    const savingsMB = (result.savings / (1024 * 1024)).toFixed(2);
    const percent = ((1 - result.newSize / result.originalSize) * 100).toFixed(1);
    console.log(`  ${index + 1}. ${result.filename}`);
    console.log(`     Saved: ${savingsMB}MB (${percent}% reduction)`);
  });
  
  console.log('\n======================================');
  console.log('📁 Trimmed videos saved to: temp_trimmed/');
  console.log('======================================\n');
  
  console.log('⚠️  NEXT STEPS:');
  console.log('1. Review the trimmed videos in temp_trimmed/');
  console.log('2. If satisfied, run: npm run replace-videos');
  console.log('3. Then run: npm run upload\n');
}

// Run the processor
processAllVideos().catch(console.error);
