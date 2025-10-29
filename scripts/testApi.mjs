#!/usr/bin/env node

/**
 * API Connection Test Script
 * Tests the API server connection and logs detailed diagnostics
 */

const API_URL = 'http://localhost:3001/api/videos';

console.log('🧪 API Connection Test\n');
console.log('=' .repeat(60));
console.log('Target:', API_URL);
console.log('=' .repeat(60), '\n');

async function testConnection() {
  try {
    console.log('1️⃣ Testing basic connectivity...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('⏱️ Request timed out after 10 seconds');
    }, 10000);
    
    const startTime = Date.now();
    const response = await fetch(API_URL, {
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    
    console.log('✅ Connection successful!');
    console.log(`⏱️ Response time: ${duration}ms`);
    console.log(`📡 Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
    console.log();
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API returned error:');
      console.error('Status:', response.status);
      console.error('Body:', errorText);
      process.exit(1);
    }
    
    console.log('2️⃣ Parsing JSON response...');
    const data = await response.json();
    
    console.log('✅ JSON parsed successfully!');
    console.log(`📊 Total videos: ${data.length}`);
    console.log();
    
    if (data.length > 0) {
      console.log('3️⃣ Sample video data:');
      const sample = data[0];
      console.log('  ID:', sample.id);
      console.log('  Location:', sample.location?.name, sample.location?.country);
      console.log('  Duration:', sample.duration, 'seconds');
      console.log('  Video URL:', sample.videoUrl);
      console.log('  Creator:', sample.creator?.username);
      console.log('  Views:', sample.views?.toLocaleString());
      console.log('  Likes:', sample.likes?.toLocaleString());
      console.log();
      
      console.log('4️⃣ Testing video stream URL...');
      const streamUrl = sample.videoUrl;
      const streamResponse = await fetch(streamUrl, {
        method: 'HEAD', // Just check headers, don't download
        headers: {
          'Range': 'bytes=0-1023' // Request first 1KB
        }
      });
      
      console.log(`✅ Stream URL accessible: ${streamResponse.status}`);
      console.log(`📦 Content-Type: ${streamResponse.headers.get('content-type')}`);
      console.log(`📏 Content-Length: ${streamResponse.headers.get('content-length')} bytes`);
      console.log();
    }
    
    console.log('=' .repeat(60));
    console.log('🎉 All tests passed!');
    console.log('=' .repeat(60));
    console.log('\n✅ The API is working correctly.');
    console.log('💡 If the frontend still has issues, try:');
    console.log('   1. Hard refresh the browser (Ctrl+Shift+R)');
    console.log('   2. Clear browser cache');
    console.log('   3. Check browser console for CORS errors');
    console.log('   4. Ensure frontend is connecting to http://localhost:3001\n');
    
  } catch (error) {
    console.error('\n❌ Test failed!\n');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'AbortError') {
      console.error('\n⏱️ Request timed out');
      console.error('💡 This usually means:');
      console.error('   1. API server is not running');
      console.error('   2. API server is starting up slowly');
      console.error('   3. Supabase connection is slow');
      console.error('\n🔧 Try: npm run api');
    } else if (error.message.includes('fetch')) {
      console.error('\n🔌 Connection refused');
      console.error('💡 This usually means:');
      console.error('   1. API server is not running on port 3001');
      console.error('   2. Wrong port number');
      console.error('   3. Firewall blocking the connection');
      console.error('\n🔧 Try: npm run api');
    } else if (error.message.includes('JSON')) {
      console.error('\n📋 Invalid JSON response');
      console.error('💡 The API returned non-JSON data');
      console.error('   Check the API server logs for errors');
    }
    
    console.error('\n🔧 Troubleshooting steps:');
    console.error('   1. Verify API server is running: npm run api');
    console.error('   2. Check if port 3001 is available');
    console.error('   3. Test manually: curl http://localhost:3001/api/videos');
    console.error('   4. Check Supabase connection in .env file');
    console.error();
    
    process.exit(1);
  }
}

testConnection();
