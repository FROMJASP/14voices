import { NextResponse } from 'next/server';
import { clearCache } from '@/lib/data-fetching-server';

export async function POST() {
  try {
    // Clear all cached data
    clearCache();

    return NextResponse.json({
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      {
        error: 'Failed to clear cache',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
