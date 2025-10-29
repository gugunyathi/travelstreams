import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicPath = path.join(__dirname, '..', 'public');
const tempPath = path.join(__dirname, '..', 'temp_trimmed');
const backupPath = path.join(__dirname, '..', 'backup_original_videos');

console.log('🔄 TravelStreamz Video Replacer\n');
console.log('======================================\n');

// Check if temp folder exists
if (!fs.existsSync(tempPath)) {
  console.log('❌ Error: temp_trimmed folder not found!');
  console.log('Please run: npm run trim-videos first\n');
  process.exit(1);
}

// Create backup folder
if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath, { recursive: true });
  console.log('📁 Created backup folder: backup_original_videos/\n');
}

// Get trimmed videos
const trimmedFiles = fs.readdirSync(tempPath).filter(file => file.endsWith('.mp4'));

if (trimmedFiles.length === 0) {
  console.log('❌ No trimmed videos found in temp_trimmed folder\n');
  process.exit(1);
}

console.log(`📹 Found ${trimmedFiles.length} trimmed videos\n`);
console.log('Starting replacement process...\n');

let replacedCount = 0;
let backedUpCount = 0;

for (const trimmedFile of trimmedFiles) {
  const originalName = trimmedFile.replace('_3s.mp4', '_tiny.mp4');
  const originalPath = path.join(publicPath, originalName);
  const trimmedPath = path.join(tempPath, trimmedFile);
  const backupFilePath = path.join(backupPath, originalName);
  
  console.log(`Processing: ${originalName}`);
  
  try {
    // Backup original if it exists
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, backupFilePath);
      console.log(`  ✓ Backed up original to backup_original_videos/`);
      backedUpCount++;
      
      // Delete original
      fs.unlinkSync(originalPath);
    }
    
    // Copy trimmed video to public folder
    fs.copyFileSync(trimmedPath, originalPath);
    console.log(`  ✓ Replaced with trimmed version\n`);
    replacedCount++;
    
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}\n`);
  }
}

console.log('======================================');
console.log('📊 REPLACEMENT SUMMARY');
console.log('======================================\n');

console.log(`✅ Replaced: ${replacedCount} videos`);
console.log(`💾 Backed up: ${backedUpCount} original videos`);
console.log(`📁 Backup location: backup_original_videos/\n`);

console.log('======================================');
console.log('✨ DONE!');
console.log('======================================\n');

console.log('⚠️  NEXT STEPS:');
console.log('1. Run: npm run upload');
console.log('2. This will upload the trimmed videos to Supabase');
console.log('3. Test the app: npm run dev:all\n');

console.log('💡 TIP: Original videos are safely backed up!');
console.log('   You can restore them from backup_original_videos/ if needed\n');
