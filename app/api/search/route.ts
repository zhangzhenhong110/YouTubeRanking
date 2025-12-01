import { NextRequest, NextResponse } from 'next/server';
import { searchParamsSchema } from '@/lib/validation';
import { searchTopVideos } from '@/lib/youtube';
import { cache } from '@/lib/cache';
import { ApiError } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    
    const validationResult = searchParamsSchema.safeParse(searchParams);
    
    if (!validationResult.success) {
      const error: ApiError = {
        error: 'Validation Error',
        message: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
        statusCode: 400,
      };
      return NextResponse.json(error, { status: 400 });
    }

    const params = validationResult.data;

    // Generate cache key
    const cacheKey = cache.generateKey(params);

    // Check cache
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log(`[Cache HIT] Query: "${params.q}", Time: ${Date.now() - startTime}ms`);
      return NextResponse.json(cachedResult);
    }

    console.log(`[Cache MISS] Query: "${params.q}", Starting YouTube API search...`);

    // Fetch from YouTube API
    const result = await searchTopVideos(params);

    // Cache the result
    cache.set(cacheKey, result);

    const duration = Date.now() - startTime;
    console.log(`[Search Complete] Query: "${params.q}", Videos: ${result.count}, Time: ${duration}ms`);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API Error]', error);

    let statusCode = 500;
    let errorMessage = error?.message || 'Internal server error';

    // Map specific errors to status codes
    if (errorMessage.includes('quota exceeded') || errorMessage.includes('invalid API key')) {
      statusCode = 403;
    } else if (errorMessage.includes('Rate limit')) {
      statusCode = 429;
    } else if (errorMessage.includes('temporarily unavailable')) {
      statusCode = 503;
    }

    const apiError: ApiError = {
      error: 'API Error',
      message: errorMessage,
      statusCode,
    };

    return NextResponse.json(apiError, { status: statusCode });
  }
}






