'use client';

import Image from 'next/image';
import { ExternalLink, Eye, Clock, Calendar } from 'lucide-react';
import { VideoItem } from '@/lib/types';
import { formatNumber, formatDuration, formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface VideoCardProps {
  video: VideoItem;
  rank: number;
}

export function VideoCard({ video, rank }: VideoCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative aspect-video bg-muted">
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Thumbnail
            </div>
          )}
          
          {/* Rank Badge */}
          <div className="absolute top-2 left-2 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold">
            #{rank}
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(video.duration)}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>

          {/* Channel */}
          <p className="text-sm text-muted-foreground mb-3">
            {video.channelTitle}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="font-medium">{formatNumber(video.viewCount)}</span>
              <span>views</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(video.publishedAt)}</span>
            </div>
          </div>

          {/* External Link Icon */}
          <div className="mt-3 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Watch on YouTube
            <ExternalLink className="w-4 h-4" />
          </div>
        </CardContent>
      </a>
    </Card>
  );
}






