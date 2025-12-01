# YouTube Top Videos Search

A modern web application built with Next.js that searches YouTube for the most viewed videos based on keywords and time ranges.

## Features

- 🔍 **Smart Search**: Search YouTube videos by keyword
- ⏰ **Time Filtering**: Filter by 24h, 7d, 30d, or custom date ranges
- 📊 **View Count Sorting**: Results sorted by view count
- 🌍 **Region Support**: Filter by region code (US, GB, JP, etc.)
- 🛡️ **Safe Search**: Configurable content filtering
- 💾 **Smart Caching**: Reduces API calls with in-memory caching
- 🚦 **Rate Limiting**: Built-in rate limiting to respect API quotas
- 🎨 **Modern UI**: Beautiful, responsive interface with shadcn/ui
- ♿ **Accessible**: ARIA labels and keyboard navigation support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: YouTube Data API v3
- **Validation**: Zod
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- YouTube Data API v3 Key ([Get one here](https://console.cloud.google.com/apis/credentials))

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your YouTube API key:

```env
YOUTUBE_API_KEY=your_actual_api_key_here
CACHE_TTL=3600
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## How to Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Go to **Credentials** and create an **API Key**
5. (Optional) Restrict the API key to YouTube Data API v3 only

## API Endpoints

### `GET /api/search`

Search for top videos by view count.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search keyword |
| `timeRange` | string | No | `7d` | Time range: `24h`, `7d`, `30d`, or `custom` |
| `start` | string | Conditional | - | Start date (ISO 8601 UTC) - required if `timeRange=custom` |
| `end` | string | Conditional | - | End date (ISO 8601 UTC) - required if `timeRange=custom` |
| `limit` | number | No | `10` | Number of results to return (1-50) |
| `candidates` | number | No | `80` | Number of candidates to fetch before sorting (10-200) |
| `regionCode` | string | No | - | Two-letter country code (e.g., `US`, `GB`, `JP`) |
| `safeSearch` | string | No | `moderate` | Safe search level: `none`, `moderate`, or `strict` |

**Example Request:**

```bash
curl "http://localhost:3000/api/search?q=Jesus&timeRange=7d&limit=10"
```

**Example Response:**

```json
{
  "query": "Jesus",
  "timeRange": {
    "start": "2025-10-16T00:00:00.000Z",
    "end": "2025-10-23T00:00:00.000Z"
  },
  "count": 10,
  "items": [
    {
      "title": "Video Title",
      "videoId": "dQw4w9WgXcQ",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "channelTitle": "Channel Name",
      "viewCount": 1234567,
      "publishedAt": "2025-10-20T12:00:00Z",
      "duration": "PT5M30S",
      "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    }
  ]
}
```

## Architecture

### Backend (API Routes)

- **`/app/api/search/route.ts`**: Main search endpoint
- **`/lib/youtube.ts`**: YouTube API integration with exponential backoff
- **`/lib/cache.ts`**: In-memory caching with TTL
- **`/lib/rate-limiter.ts`**: Token bucket rate limiting
- **`/lib/validation.ts`**: Zod schemas for input validation

### Frontend (React Components)

- **`/app/page.tsx`**: Main page with search orchestration
- **`/components/search-form.tsx`**: Search form with all options
- **`/components/video-results.tsx`**: Results grid display
- **`/components/video-card.tsx`**: Individual video card
- **`/components/error-display.tsx`**: Error handling UI

## Caching Strategy

The application uses in-memory caching to reduce API quota consumption:

- **Cache Key**: Generated from all search parameters
- **TTL**: Configurable via `CACHE_TTL` environment variable (default: 1 hour)
- **Cleanup**: Automatic cleanup every 10 minutes

## Rate Limiting

Built-in rate limiter ensures compliance with YouTube API guidelines:

- **Default**: 5 requests per second
- **Strategy**: Token bucket algorithm
- **Retry**: Exponential backoff on 429/5xx errors (max 3 retries)

## Quota Management

YouTube Data API v3 has daily quotas:

- **Default Quota**: 10,000 units/day
- **search.list**: 100 units per request
- **videos.list**: 1 unit per request

**Example calculation** for a search with 80 candidates:
- 2 search.list requests (50 items each): 200 units
- 2 videos.list requests (50 IDs each): 2 units
- **Total**: ~202 units per unique search

To request higher quotas, visit the [Google Cloud Console](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas).

## Compliance

This application strictly follows YouTube's Terms of Service:

- ✅ Uses official YouTube Data API v3 only
- ✅ No web scraping or unofficial methods
- ✅ Includes privacy policy links
- ✅ Respects rate limits and quotas
- ✅ Provides user data access/revocation (if OAuth is added)

See: [YouTube API Services Terms of Service](https://developers.google.com/youtube/terms/api-services-terms-of-service)

## Testing Checklist

- [ ] Basic search with keyword returns sorted results
- [ ] Time range filtering works correctly (24h, 7d, 30d, custom)
- [ ] Custom date range validation (start <= end)
- [ ] Empty results handled gracefully
- [ ] API errors display user-friendly messages
- [ ] Cache hit/miss logged correctly
- [ ] Rate limiting prevents request bursts
- [ ] Region code filtering works
- [ ] Safe search levels apply correctly
- [ ] Responsive design on mobile/tablet/desktop

## Troubleshooting

### "YouTube API quota exceeded"

- Check your [quota usage](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)
- Wait until the daily quota resets (midnight Pacific Time)
- Request a quota increase from Google

### "Invalid API key"

- Verify your API key is correct in `.env.local`
- Ensure YouTube Data API v3 is enabled in Google Cloud Console
- Check if API key restrictions are properly configured

### "Rate limit exceeded"

- The app will automatically retry with exponential backoff
- If persistent, reduce the `candidates` parameter
- Increase time between searches

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This is an independent project and is not affiliated with, endorsed by, or sponsored by YouTube or Google.






