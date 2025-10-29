# Error Logging & Diagnostics

## Overview
Enhanced error logging has been added to both the API server and frontend to help identify and troubleshoot connection issues.

## API Server Logging

### Startup Logs
```
🚀 Starting API server...
📍 Port: 3001
🌍 Environment: development
🔌 Attempting to connect to MongoDB...
📍 URI: mongodb+srv://user:****@cluster0...
✅ Connected to MongoDB successfully
📦 Database: travelstreamz
🎬 GridFS Bucket: videos
📹 Videos in collection: 46
📁 Files in GridFS: 46
✅ API server running successfully
🌐 Local: http://localhost:3001
🔗 Videos endpoint: http://localhost:3001/api/videos
⏳ Waiting for requests...
```

### Request Logs
- **GET /api/videos**: Shows video count, processing time, and response size
- **GET /api/videos/stream/:fileId**: Shows video filename, file size, and streaming details (range vs full)

### Error Logs
- Connection errors with detailed diagnostics
- MongoDB query errors with stack traces
- Streaming errors with file IDs
- Port conflicts with resolution steps

## Frontend Logging

### API Fetch Logs
```
🔄 Fetching videos from API...
📍 API URL: http://localhost:3001/api/videos
📡 Response status: 200 OK
📋 Response headers: {...}
✅ Successfully fetched data
📊 Video count: 46
📦 Sample video: {...}
✅ Loaded 46 videos from MongoDB
```

### Error Diagnostics
- **Timeout errors**: Shows 10-second timeout with possible causes
- **Connection errors**: Identifies if API server is down
- **CORS errors**: Detects cross-origin issues
- **JSON parse errors**: Identifies malformed responses

### Video Loading Logs
```
⚡ Video loaded in 234ms - Bali
⚡ Video loaded in 189ms - Paris
⚡ Video loaded in 512ms - Tokyo
```

## Testing Script

Run comprehensive API tests:
```bash
node scripts/testApi.mjs
```

This will test:
1. Basic connectivity
2. JSON response parsing
3. Video data structure
4. Stream URL accessibility

## Common Issues & Solutions

### Issue: "Failed to fetch"
**Symptoms:**
- Error in browser console: `TypeError: Failed to fetch`
- Frontend shows placeholder videos

**Diagnosis:**
```
❌ Error fetching videos:
Error type: TypeError
Error message: Failed to fetch
🔌 Connection failed
💡 Possible causes:
  1. API server not running on port 3001
  2. CORS issues
  3. Firewall blocking connection
  4. Check if API server is running: npm run api
```

**Solution:**
```bash
# Start API server
npm run api

# Or start both servers
npm run dev:all
```

### Issue: "Request timed out"
**Symptoms:**
- Loading spinner for 10+ seconds
- Eventually shows placeholder videos

**Diagnosis:**
```
⏱️ Request timed out after 10 seconds
💡 Possible causes:
  1. API server is not running
  2. MongoDB connection is slow
  3. Network issues
```

**Solution:**
```bash
# Check if API server is running
Get-Process -Name node

# Restart API server
npm run api

# Test MongoDB connection
node scripts/checkDatabase.mjs
```

### Issue: Port already in use
**Symptoms:**
- API won't start
- Error: `EADDRINUSE`

**Diagnosis:**
```
❌ Server error:
Error code: EADDRINUSE
Error message: Port 3001 is already in use

💡 Port 3001 is already in use.
Solutions:
1. Kill the process using port 3001
2. Use a different port in .env file
```

**Solution:**
```powershell
# Find process on port 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess

# Kill the process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

## Health Check

Test API health:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-25T...",
  "mongodb": "connected",
  "uptime": 123.45
}
```

## Server Management

### Start servers separately:
```bash
# Terminal 1: API server
npm run api

# Terminal 2: Frontend
npm run dev
```

### Start both together (Windows):
```bash
npm run dev:all
```

### Check running servers:
```powershell
# Check Node processes
Get-Process -Name node

# Check ports
Get-NetTCPConnection -LocalPort 3001,8080
```

### Stop all servers:
```powershell
# Stop all Node processes
Get-Process -Name node | Stop-Process -Force
```

## Log Locations

- **API Server**: Console output from `npm run api`
- **Frontend**: Browser DevTools Console (F12)
- **Database**: Use `node scripts/checkDatabase.mjs`

## Monitoring Tips

1. **Keep API terminal visible** - Watch for request logs
2. **Keep browser console open** - Check for fetch errors
3. **Use Network tab** - Inspect HTTP requests/responses
4. **Test with curl** - Verify API works outside browser

## Performance Metrics

With enhanced logging, you can now track:
- API response times
- Video load times
- MongoDB query performance
- Stream throughput

Example:
```
📥 GET /api/videos - Fetching all videos
✅ Found 46 videos in 45ms
📤 Sent 46 videos to client
⚡ Video loaded in 234ms - Bali
```

## Next Steps

If issues persist after checking logs:
1. Verify `.env` file has correct MongoDB URI
2. Check MongoDB Atlas is online and accessible
3. Verify IP whitelist in MongoDB Atlas
4. Test with `scripts/testApi.mjs`
5. Check firewall/antivirus settings
