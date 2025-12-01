# 🚀 Quick Start Guide

Get your YouTube Top Videos Search app running in **5 minutes**!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Get YouTube API Key (2 min)

1. Visit: https://console.cloud.google.com/
2. Create/Select a project
3. Enable "YouTube Data API v3"
4. Create credentials → API Key
5. Copy the API key

## Step 3: Configure Environment (30 sec)

Create `.env.local`:

```bash
YOUTUBE_API_KEY=paste_your_api_key_here
CACHE_TTL=3600
```

## Step 4: Start the Server (30 sec)

```bash
npm run dev
```

## Step 5: Open in Browser (30 sec)

Visit: http://localhost:3000

## 🎉 Done!

Try searching for "Jesus", "Python tutorial", or any keyword you like!

---

## ⚡ Quick Commands

```bash
# Verify setup
node verify-setup.js

# Test API
node test-api.js Jesus 7d

# Build for production
npm run build
npm start
```

## 🆘 Quick Troubleshooting

**Port 3000 already in use?**
```bash
PORT=3001 npm run dev
```

**API key not working?**
- Double-check the key in `.env.local`
- Restart the dev server
- Make sure YouTube Data API v3 is enabled

**No results found?**
- Try a popular keyword like "music"
- Expand time range to 30 days
- Check your API quota usage

---

## 📖 Full Documentation

- [README.md](./README.md) - Complete guide
- [SETUP.md](./SETUP.md) - Detailed setup
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Architecture






