# Deployment Guide

## Problem
Your app is deployed on Vercel (HTTPS) but trying to connect to `http://localhost:3001` (HTTP + wrong host), causing mixed content errors.

## Solution Overview
The app now uses environment variables to configure the API URL dynamically:
- **Development**: Uses `http://localhost:3001/api`
- **Production**: Uses your deployed API URL (needs to be set up)

## Changes Made

### 1. Frontend (`src/hooks/useVideos.ts`)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### 2. Backend (`server/api.mjs`)
```javascript
const API_URL = process.env.API_URL || `http://localhost:${PORT}`;
// Video URLs now use: `${API_URL}/api/videos/stream/${fileId}`
```

### 3. Environment Files
- `.env` - Development configuration (localhost)
- `.env.production.example` - Production template

## Deployment Steps

### Option 1: Deploy API to Vercel (Recommended)

1. **Create `vercel.json` in project root:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/api.mjs",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/api.mjs"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "API_URL": "https://travelstreamz.vercel.app"
  }
}
```

2. **Add MongoDB secret to Vercel:**
```bash
vercel secrets add mongodb-uri "mongodb+srv://basevibecoders_db_user:00Bh7MFd0oCNSvPb@cluster0.el7at0x.mongodb.net/"
```

3. **Set environment variable in Vercel dashboard:**
   - Go to: https://vercel.com/your-project/settings/environment-variables
   - Add: `VITE_API_URL` = `https://travelstreamz.vercel.app/api`
   - Add: `API_URL` = `https://travelstreamz.vercel.app`

4. **Redeploy:**
```bash
git add .
git commit -m "Add API deployment configuration"
git push origin main
```

### Option 2: Deploy API to Railway

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Deploy API:**
```bash
railway login
railway init
railway up
```

3. **Set environment variables in Railway dashboard:**
   - `MONGODB_URI` = your MongoDB connection string
   - `PORT` = 3001

4. **Update Vercel environment variables:**
   - `VITE_API_URL` = `https://your-railway-app.railway.app/api`

### Option 3: Deploy API to Render

1. **Create `render.yaml`:**
```yaml
services:
  - type: web
    name: travelstreamz-api
    env: node
    buildCommand: npm install
    startCommand: node server/api.mjs
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production
```

2. **Deploy to Render:**
   - Connect your GitHub repo
   - Add MongoDB URI in environment variables

3. **Update Vercel:**
   - Set `VITE_API_URL` to your Render URL

## Current Status

✅ **Code Changes**: Complete - app is now environment-aware
❌ **API Deployment**: Not yet deployed - needs to be set up
⚠️ **Production**: Currently shows placeholder videos (API not accessible)

## Quick Test Locally

1. **Terminal 1 - Start API:**
```bash
npm run api
```

2. **Terminal 2 - Start Frontend:**
```bash
npm run dev
```

3. **Open:** http://localhost:8080
   - Should load 46 videos from MongoDB
   - No mixed content errors

## For Vercel Deployment

Since your frontend is already on Vercel, you have two paths:

### Path A: Co-locate API with Frontend (Easiest)
Deploy the API as a Vercel serverless function alongside your frontend.

**Pros:**
- Single deployment
- Same domain (no CORS issues)
- Automatic HTTPS

**Cons:**
- Serverless functions have execution time limits (10s on free plan)
- Video streaming might timeout for large files

### Path B: Separate API Deployment (Better for Video)
Deploy API to Railway/Render/Fly.io for dedicated server.

**Pros:**
- No timeout limits
- Better performance for video streaming
- More control

**Cons:**
- Two deployments to manage
- Need to configure CORS

## Recommended: Path B (Railway)

Railway is easiest for Node.js APIs:

1. **Push your code to GitHub** (already done ✅)

2. **Go to Railway:** https://railway.app/
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose `travelstreamz`

3. **Configure environment variables:**
   ```
   MONGODB_URI=mongodb+srv://...
   PORT=3001
   NODE_ENV=production
   ```

4. **Railway will auto-deploy** and give you a URL like:
   `https://travelstreamz-api-production.up.railway.app`

5. **Update Vercel environment variables:**
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-railway-url.up.railway.app/api`

6. **Redeploy Vercel** (triggers automatic rebuild with new env vars)

## Testing Production

After deployment, check browser console:
- ✅ Should see: `📡 Response status: 200 OK`
- ✅ Should see: `✅ Loaded 46 videos from MongoDB`
- ❌ No more "Mixed Content" errors

## Cost Estimate

- **Vercel (Frontend)**: Free tier ✅
- **Railway (API)**: Free tier ($5 credit/month) ✅
- **MongoDB Atlas**: Free tier (512MB) ✅

**Total: $0/month** for low traffic

## Next Steps

1. ✅ Test locally to verify changes work
2. ⏳ Deploy API to Railway/Vercel
3. ⏳ Update environment variables
4. ⏳ Test production deployment

## Support

If you encounter issues:
1. Check browser console for errors
2. Check API logs (Railway/Vercel dashboard)
3. Verify environment variables are set correctly
4. Test API directly: `curl https://your-api-url.com/health`
