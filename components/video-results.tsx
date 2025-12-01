'use client';

import { VideoCard } from '@/components/video-card';
import { SearchResponse } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Info } from 'lucide-react';

interface VideoResultsProps {
  results: SearchResponse;
}

export function VideoResults({ results }: VideoResultsProps) {
  if (results.count === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-12 text-center">
          <Info className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Videos Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search parameters or time range to find more results.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Top {results.count} Videos
              </h2>
              <p className="text-muted-foreground">
                Search: <span className="font-semibold text-foreground">{results.query}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Time Range: {new Date(results.timeRange.start).toLocaleDateString()} - {new Date(results.timeRange.end).toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{results.count}</p>
              <p className="text-sm text-muted-foreground">Results</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.items.map((video, index) => (
          <VideoCard key={video.videoId} video={video} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}






