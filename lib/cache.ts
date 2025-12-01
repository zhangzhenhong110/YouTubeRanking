import { SearchResponse } from './types';

interface CacheEntry {
  data: SearchResponse;
  timestamp: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private ttl: number;

  constructor(ttlSeconds: number = 3600) {
    this.ttl = ttlSeconds * 1000; // Convert to milliseconds
  }

  generateKey(params: Record<string, any>): string {
    // Sort keys for consistent cache keys
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);
    
    return JSON.stringify(sortedParams);
  }

  get(key: string): SearchResponse | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: SearchResponse): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
const cacheTTL = parseInt(process.env.CACHE_TTL || '3600', 10);
export const cache = new MemoryCache(cacheTTL);

// Periodic cleanup (every 10 minutes)
if (typeof window === 'undefined') { // Server-side only
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}


