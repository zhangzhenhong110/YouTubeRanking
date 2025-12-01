'use client';

import { useState } from 'react';
import { SearchForm } from '@/components/search-form';
import { VideoResults } from '@/components/video-results';
import { ErrorDisplay } from '@/components/error-display';
import { SearchParams, SearchResponse } from '@/lib/types';
import { Youtube } from 'lucide-react';

export default function Home() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', params.q);
      queryParams.append('timeRange', params.timeRange);
      queryParams.append('limit', params.limit?.toString() || '10');
      queryParams.append('candidates', params.candidates?.toString() || '80');
      queryParams.append('safeSearch', params.safeSearch || 'moderate');
      
      if (params.start) queryParams.append('start', params.start);
      if (params.end) queryParams.append('end', params.end);
      if (params.regionCode) queryParams.append('regionCode', params.regionCode);

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search videos');
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Youtube className="w-12 h-12 text-red-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">
              YouTube Top Videos
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Search and discover the most viewed videos by keyword
          </p>
        </header>

        {/* Search Form */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Searching YouTube...</p>
          </div>
        )}

        {/* Error Display */}
        {error && !isLoading && (
          <ErrorDisplay error={error} onRetry={handleRetry} />
        )}

        {/* Results */}
        {results && !isLoading && !error && (
          <VideoResults results={results} />
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground border-t pt-8">
          <p>
            This application uses the{' '}
            <a
              href="https://developers.google.com/youtube/v3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              YouTube Data API v3
            </a>
            . Data is subject to YouTube's Terms of Service.
          </p>
          <p className="mt-2">
            By using this service, you agree to Google's{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}






