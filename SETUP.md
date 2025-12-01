# Quick Setup Guide

Follow these steps to get your YouTube Top Videos Search application running in minutes.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get YouTube API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

## Step 3: Configure Environment

Create `.env.local` file:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and paste your API key:

```env
YOUTUBE_API_KEY=AIzaSyC_your_actual_api_key_here
CACHE_TTL=3600
```

**Important**: Never commit `.env.local` to git!

## Step 4: Run the Application

Start the development server:

```bash
npm run dev
```

Open your browser to [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

1. Enter a keyword (e.g., "Jesus", "Python tutorial", "Music")
2. Select a time range (default: Last 7 Days)
3. Click "Search Videos"
4. View the top videos sorted by view count!

## Common Issues

### Issue: "YouTube API quota exceeded"

**Solution**: 
- Default quota is 10,000 units/day
- Each search uses ~200-500 units depending on candidates
- Wait until quota resets (midnight Pacific Time) or request increase

### Issue: "Invalid API key"

**Solution**:
- Double-check the API key in `.env.local`
- Ensure YouTube Data API v3 is enabled
- Restart the dev server after changing `.env.local`

### Issue: Port 3000 already in use

**Solution**:
```bash
# Use a different port
PORT=3001 npm run dev
```

### Issue: No results found

**Solution**:
- Try a broader keyword
- Expand the time range (e.g., 30 days instead of 24 hours)
- Check if region code is too restrictive

## Production Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variable `YOUTUBE_API_KEY`
4. Deploy!

### Option 2: Traditional Server

```bash
# Build the application
npm run build

# Start production server
npm start
```

Set environment variables in your hosting platform.

## API Quota Guidelines

**Careful with these parameters to manage quota:**

- **candidates**: Higher = more accurate but more quota
  - 50 candidates ≈ 150 units
  - 80 candidates ≈ 250 units (default)
  - 200 candidates ≈ 500 units

- **Cache**: Hits save quota significantly
  - Default TTL: 1 hour
  - Same searches within TTL use 0 additional quota

**Daily budget planning:**

- 10,000 units ÷ 250 units/search = ~40 unique searches/day
- With caching, you can handle many more repeat searches

## Next Steps

- Customize the UI colors in `tailwind.config.ts`
- Adjust cache TTL in `.env.local`
- Add analytics (if desired)
- Implement user favorites (requires database)
- Add OAuth for personalized features

## Need Help?

- Check the main [README.md](./README.md) for detailed docs
- Review [PRIVACY.md](./PRIVACY.md) for privacy compliance
- Read [YouTube API Documentation](https://developers.google.com/youtube/v3)

## Security Reminders

✅ **DO**:
- Keep `.env.local` in `.gitignore`
- Use environment variables for API keys
- Restrict API key to YouTube Data API v3 only
- Enable HTTPS in production

❌ **DON'T**:
- Commit API keys to git
- Share API keys publicly
- Exceed your daily quota
- Violate YouTube's Terms of Service

Happy searching! 🚀






