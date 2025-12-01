'use client';

import { useState, FormEvent } from 'react';
import { Search, Calendar, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchParams } from '@/lib/types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [keyword, setKeyword] = useState('Jesus');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'custom'>('7d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [regionCode, setRegionCode] = useState('');
  const [safeSearch, setSafeSearch] = useState<'none' | 'moderate' | 'strict'>('moderate');
  const [limit, setLimit] = useState(10);
  const [candidates, setCandidates] = useState(80);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const params: SearchParams = {
      q: keyword.trim(),
      timeRange,
      limit,
      candidates,
      safeSearch,
    };

    if (timeRange === 'custom') {
      if (startDate) params.start = new Date(startDate).toISOString();
      if (endDate) params.end = new Date(endDate).toISOString();
    }

    if (regionCode) {
      params.regionCode = regionCode.toUpperCase();
    }

    onSearch(params);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          YouTube Top Videos Search
        </CardTitle>
        <CardDescription>
          Search for the most viewed videos by keyword and time range
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Keyword */}
          <div className="space-y-2">
            <Label htmlFor="keyword">Keyword *</Label>
            <Input
              id="keyword"
              type="text"
              placeholder="Enter search keyword (e.g., Jesus, Python, Music)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeRange" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Time Range
              </Label>
              <Select
                id="timeRange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                disabled={isLoading}
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">Results Limit</Label>
              <Select
                id="limit"
                value={limit.toString()}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                disabled={isLoading}
              >
                <option value="5">Top 5</option>
                <option value="10">Top 10</option>
                <option value="20">Top 20</option>
                <option value="50">Top 50</option>
              </Select>
            </div>
          </div>

          {/* Custom Date Range */}
          {timeRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (UTC)</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isLoading}
                  required={timeRange === 'custom'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (UTC)</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isLoading}
                  required={timeRange === 'custom'}
                />
              </div>
            </div>
          )}

          {/* Advanced Options */}
          <details className="space-y-4">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Advanced Options
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="regionCode" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Region Code
                </Label>
                <Input
                  id="regionCode"
                  type="text"
                  placeholder="US, GB, JP..."
                  maxLength={2}
                  value={regionCode}
                  onChange={(e) => setRegionCode(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="safeSearch" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Safe Search
                </Label>
                <Select
                  id="safeSearch"
                  value={safeSearch}
                  onChange={(e) => setSafeSearch(e.target.value as any)}
                  disabled={isLoading}
                >
                  <option value="none">None</option>
                  <option value="moderate">Moderate</option>
                  <option value="strict">Strict</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidates">Candidates</Label>
                <Input
                  id="candidates"
                  type="number"
                  min="10"
                  max="200"
                  value={candidates}
                  onChange={(e) => setCandidates(parseInt(e.target.value))}
                  disabled={isLoading}
                />
              </div>
            </div>
          </details>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !keyword.trim()}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search Videos
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}






