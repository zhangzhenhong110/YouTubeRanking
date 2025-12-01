import { z } from 'zod';

export const searchParamsSchema = z.object({
  q: z.string().min(1, 'Keyword is required'),
  timeRange: z.enum(['24h', '7d', '30d', 'custom']).default('7d'),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Must be ISO 8601 UTC (e.g., 2025-01-01T00:00:00Z)').optional(),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, 'Must be ISO 8601 UTC (e.g., 2025-01-01T00:00:00Z)').optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  candidates: z.coerce.number().int().min(10).max(200).default(80),
  regionCode: z.string().length(2).toUpperCase().optional(),
  safeSearch: z.enum(['none', 'moderate', 'strict']).default('moderate'),
}).refine(
  (data) => {
    if (data.timeRange === 'custom') {
      return data.start && data.end;
    }
    return true;
  },
  {
    message: 'Custom time range requires both start and end',
    path: ['timeRange'],
  }
).refine(
  (data) => {
    if (data.start && data.end) {
      return new Date(data.start) <= new Date(data.end);
    }
    return true;
  },
  {
    message: 'Start time must be before or equal to end time',
    path: ['start'],
  }
);

export type ValidatedSearchParams = z.infer<typeof searchParamsSchema>;


