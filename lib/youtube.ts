import { google, youtube_v3 } from 'googleapis';
import { ValidatedSearchParams } from './validation';
import { VideoItem, SearchResponse } from './types';
import { rateLimiter } from './rate-limiter';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Configure proxy if available
const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
  ...(agent && {
    // @ts-ignore - googleapis types don't include this option but it works
    transporterOptions: {
      agent,
    }
  })
});

function calculateTimeRange(timeRange: string, start?: string, end?: string): { start: string; end: string } {
  const now = new Date();
  let startDate: Date;
  let endDate = now;

  if (timeRange === 'custom' && start && end) {
    return { start, end };
  }

  switch (timeRange) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };
}

async function exponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Only retry on rate limit (429) or server errors (5xx)
      const statusCode = error?.response?.status || error?.code;
      if (statusCode === 429 || (statusCode >= 500 && statusCode < 600)) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 8000);
        console.log(`Retrying after ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

export async function searchTopVideos(params: ValidatedSearchParams): Promise<SearchResponse> {
  const timeRange = calculateTimeRange(params.timeRange, params.start, params.end);
  
  try {
    // Step 1: Search for videos
    const videoIds = await searchVideos(params, timeRange);

    if (videoIds.length === 0) {
      return {
        query: params.q,
        timeRange,
        count: 0,
        items: [],
      };
    }

    // Step 2: Get video details (statistics, snippets, content details)
    const videos = await getVideoDetails(videoIds);

    // Step 3: Sort by view count and take top N
    const sortedVideos = videos
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, params.limit);

    return {
      query: params.q,
      timeRange,
      count: sortedVideos.length,
      items: sortedVideos,
    };
  } catch (error: any) {
    console.error('YouTube API error:', error);
    
    if (error?.response?.status === 403) {
      throw new Error('YouTube API quota exceeded or invalid API key');
    } else if (error?.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error?.response?.status >= 500) {
      throw new Error('YouTube service temporarily unavailable');
    }
    
    throw new Error(error?.message || 'Failed to search videos');
  }
}

async function searchVideos(
  params: ValidatedSearchParams,
  timeRange: { start: string; end: string }
): Promise<string[]> {
  const videoIds: string[] = [];
  let pageToken: string | undefined;
  const maxResults = 50; // YouTube API max per page
  const targetCandidates = params.candidates || 80;

  while (videoIds.length < targetCandidates) {
    await rateLimiter.throttle();

    const response = await exponentialBackoff(async () => {
      return youtube.search.list({
        part: ['id'],
        q: params.q,
        type: ['video'],
        order: 'viewCount',
        publishedAfter: timeRange.start,
        publishedBefore: timeRange.end,
        maxResults: Math.min(maxResults, targetCandidates - videoIds.length),
        pageToken,
        regionCode: params.regionCode,
        safeSearch: params.safeSearch,
        relevanceLanguage: params.regionCode === 'US' ? 'en' : undefined,
      });
    });

    const items = response.data.items || [];
    
    for (const item of items) {
      if (item.id?.videoId) {
        videoIds.push(item.id.videoId);
      }
    }

    pageToken = response.data.nextPageToken || undefined;

    // Break if no more results
    if (!pageToken || items.length === 0) {
      break;
    }
  }

  return videoIds;
}

async function getVideoDetails(videoIds: string[]): Promise<VideoItem[]> {
  const videos: VideoItem[] = [];
  const batchSize = 50; // YouTube API max IDs per request

  // Process in batches of 50
  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batch = videoIds.slice(i, i + batchSize);
    
    await rateLimiter.throttle();

    const response = await exponentialBackoff(async () => {
      return youtube.videos.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: batch,
      });
    });

    const items = response.data.items || [];

    for (const item of items) {
      const snippet = item.snippet;
      const statistics = item.statistics;
      const contentDetails = item.contentDetails;

      if (!snippet || !statistics || !contentDetails || !item.id) {
        continue;
      }

      videos.push({
        title: snippet.title || 'Untitled',
        videoId: item.id,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        channelTitle: snippet.channelTitle || 'Unknown Channel',
        viewCount: parseInt(statistics.viewCount || '0', 10),
        publishedAt: snippet.publishedAt || new Date().toISOString(),
        duration: contentDetails.duration || 'PT0S',
        thumbnail: snippet.thumbnails?.high?.url || 
                   snippet.thumbnails?.medium?.url || 
                   snippet.thumbnails?.default?.url || 
                   '',
      });
    }
  }

  return videos;
}


