# Quick Fix for Vercel Deployment

## The Problem
Your app on `https://travelstreamz.vercel.app/` shows mixed content errors because it's trying to load videos from `http://localhost:3001` (which doesn't exist in production).

## The Fix (2 Steps)

### Step 1: Deploy API to Railway (5 minutes)

1. **Go to Railway:** https://railway.app/new
2. **Click "Deploy from GitHub repo"**
3. **Select:** `tebogonong/travelstreamz`
4. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://basevibecoders_db_user:00Bh7MFd0oCNSvPb@cluster0.el7at0x.mongodb.net/
   PORT=3001
   NODE_ENV=production
   ```
5. **Wait for deployment** - Railway will give you a URL like:
   ```
   https://travelstreamz-production-xxxx.up.railway.app
   ```

### Step 2: Update Vercel Environment Variable

1. **Go to Vercel:** https://vercel.com/tebogonong/travelstreamz/settings/environment-variables
2. **Add new variable:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-url.up.railway.app/api`
   - **Environment:** Production
3. **Click "Save"**
4. **Redeploy:**
   - Go to Deployments tab
   - Click "..." → "Redeploy"

## Done! 🎉

Your app will now:
- ✅ Load 46 optimized videos from MongoDB
- ✅ No mixed content errors
- ✅ Work on HTTPS
- ✅ Stream videos properly

## Alternative: Deploy API to Vercel

If you prefer to keep everything on Vercel:

1. **Add `vercel.json` to your repo:**
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
  ]
}
```

2. **Push to GitHub:**
```bash
git add vercel.json
git commit -m "Add Vercel API configuration"
git push
```

3. **Set environment variables in Vercel:**
   - `MONGODB_URI` = your MongoDB connection string
   - `VITE_API_URL` = `https://travelstreamz.vercel.app/api`
   - `API_URL` = `https://travelstreamz.vercel.app`

4. **Redeploy**

## Testing

After deployment, open https://travelstreamz.vercel.app/ and check the browser console (F12):

✅ **Should see:**
```
🔄 Fetching videos from API...
📡 Response status: 200 OK
✅ Loaded 46 videos from MongoDB
```

❌ **Should NOT see:**
- Mixed Content errors
- Failed to fetch errors
- localhost references

## Cost

- **Railway Free Tier:** $5 credit/month (enough for low traffic)
- **Vercel Free Tier:** Unlimited for personal projects
- **MongoDB Atlas Free Tier:** 512MB storage

**Total: $0/month** 🎉

## Need Help?

Check the detailed guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
