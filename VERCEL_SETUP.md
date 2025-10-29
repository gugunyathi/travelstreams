# Vercel API Setup - Step by Step

✅ **Step 1: Create vercel.json** - DONE!
The configuration file has been pushed to GitHub and Vercel will detect it automatically.

---

## Step 2: Add MongoDB Secret to Vercel

You have 2 options:

### Option A: Using Vercel CLI (Faster)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Add the MongoDB secret:**
```bash
vercel secrets add mongodb-uri "mongodb+srv://basevibecoders_db_user:00Bh7MFd0oCNSvPb@cluster0.el7at0x.mongodb.net/"
```

### Option B: Using Vercel Dashboard (Easier)

1. Go to: https://vercel.com/tebogonong/travelstreamz/settings/environment-variables

2. Click **"Add New"**

3. Add these variables:

   **Variable 1:**
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://basevibecoders_db_user:00Bh7MFd0oCNSvPb@cluster0.el7at0x.mongodb.net/`
   - Environment: Production ✅, Preview ✅, Development ✅
   - Click "Save"

   **Variable 2:**
   - Key: `VITE_API_URL`
   - Value: `https://travelstreamz.vercel.app/api`
   - Environment: Production ✅, Preview ✅, Development ✅
   - Click "Save"

   **Variable 3:**
   - Key: `API_URL`
   - Value: `https://travelstreamz.vercel.app`
   - Environment: Production ✅, Preview ✅, Development ✅
   - Click "Save"

---

## Step 3: Redeploy

Vercel should automatically redeploy after pushing `vercel.json`, but to ensure environment variables are applied:

1. Go to: https://vercel.com/tebogonong/travelstreamz/deployments

2. Find the latest deployment

3. Click the **"..."** menu → **"Redeploy"**

4. Click **"Redeploy"** to confirm

---

## Step 4: Verify Deployment

Once redeployed (takes ~2 minutes):

### Test API Health:
```bash
curl https://travelstreamz.vercel.app/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-25T...",
  "mongodb": "connected",
  "uptime": 0.123
}
```

### Test Video API:
```bash
curl https://travelstreamz.vercel.app/api/videos
```

**Expected:** JSON array with 46 videos

### Test in Browser:
1. Open: https://travelstreamz.vercel.app/
2. Open DevTools Console (F12)
3. Look for:
   ```
   🔄 Fetching videos from API...
   📡 Response status: 200 OK
   ✅ Loaded 46 videos from MongoDB
   ```

---

## Troubleshooting

### Issue: 404 on /api/videos

**Cause:** `vercel.json` not deployed yet

**Fix:** Wait 2 minutes for Vercel to rebuild, or manually redeploy

---

### Issue: 500 Server Error

**Cause:** MongoDB connection failed

**Fix:**
1. Check environment variables are set correctly
2. Verify MongoDB URI is correct
3. Check Vercel logs: https://vercel.com/tebogonong/travelstreamz/logs

---

### Issue: Still shows "Mixed Content" errors

**Cause:** `VITE_API_URL` not set or not redeployed

**Fix:**
1. Verify `VITE_API_URL` is set in Vercel dashboard
2. Redeploy to rebuild frontend with new env var
3. Hard refresh browser (Ctrl+Shift+R)

---

### Issue: Videos still not loading

**Cause:** Browser cached old version

**Fix:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear site data (F12 → Application → Clear storage)
3. Try incognito mode

---

## Success Checklist

- ✅ `vercel.json` pushed to GitHub
- ⏳ Environment variables added in Vercel
- ⏳ App redeployed with new config
- ⏳ `/health` endpoint returns 200 OK
- ⏳ `/api/videos` returns 46 videos
- ⏳ Browser console shows no errors
- ⏳ Videos play automatically

---

## What Happens Now?

Once deployed:
1. **API Routes:** `/api/*` will be handled by `server/api.mjs`
2. **Static Files:** Everything else served by Vite build
3. **MongoDB:** Videos stream from GridFS via serverless functions
4. **HTTPS:** All traffic encrypted (no mixed content errors)

---

## Environment Variables Summary

| Variable | Value | Purpose |
|----------|-------|---------|
| `MONGODB_URI` | `mongodb+srv://...` | Backend MongoDB connection |
| `VITE_API_URL` | `https://travelstreamz.vercel.app/api` | Frontend API endpoint |
| `API_URL` | `https://travelstreamz.vercel.app` | Backend base URL for video streams |

---

## Need Help?

Check Vercel logs for errors:
https://vercel.com/tebogonong/travelstreamz/logs

Or test locally first:
```bash
npm run dev   # Terminal 1
npm run api   # Terminal 2
```

Then open: http://localhost:8080
