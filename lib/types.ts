export type TimeRange = '24h' | '7d' | '30d' | 'custom';
export type SafeSearch = 'none' | 'moderate' | 'strict';

export interface SearchParams {
  q: string;
  timeRange: TimeRange;
  start?: string; // ISO 8601 UTC
  end?: string; // ISO 8601 UTC
  limit?: number; // 1-50, default 10
  candidates?: number; // 10-200, default 80
  regionCode?: string; // e.g., US, GB, JP
  safeSearch?: SafeSearch; // default: moderate
}

export interface VideoItem {
  title: string;
  videoId: string;
  url: string;
  channelTitle: string;
  viewCount: number;
  publishedAt: string; // ISO 8601
  duration: string; // ISO 8601 duration
  thumbnail: string;
}

export interface SearchResponse {
  query: string;
  timeRange: {
    start: string;
    end: string;
  };
  count: number;
  items: VideoItem[];
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}


