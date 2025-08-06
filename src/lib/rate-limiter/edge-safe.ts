/**
 * Edge-safe rate limiter for Next.js middleware
 * Uses in-memory storage since Redis is not available in Edge Runtime
 */

import { securityConfig } from '@/config/security';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

interface RateLimitOptions {
  requests: number;
  window: number; // in seconds
}

// In-memory store for Edge Runtime
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Cleanup old entries on each access (passive cleanup)
function cleanupExpiredEntries() {
  const now = Date.now();
  const maxEntries = 10000; // Prevent unbounded growth

  // If store is getting too large, clean up expired entries
  if (rateLimitStore.size > maxEntries * 0.9) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (now >= value.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }

  // If still too large, remove oldest entries
  if (rateLimitStore.size > maxEntries) {
    const entriesToRemove = rateLimitStore.size - maxEntries;
    let removed = 0;
    for (const key of rateLimitStore.keys()) {
      if (removed >= entriesToRemove) break;
      rateLimitStore.delete(key);
      removed++;
    }
  }
}

export class EdgeSafeRateLimiter {
  private keyPrefix: string;

  constructor(keyPrefix = 'ratelimit:') {
    this.keyPrefix = keyPrefix;
  }

  private getKey(identifier: string, endpoint: string): string {
    return `${this.keyPrefix}${endpoint}:${identifier}`;
  }

  async checkLimit(
    identifier: string,
    endpoint: string,
    options: RateLimitOptions
  ): Promise<RateLimitResult> {
    // Periodic cleanup
    cleanupExpiredEntries();

    const key = this.getKey(identifier, endpoint);
    const now = Date.now();
    const windowMs = options.window * 1000;
    const resetAt = now + windowMs;

    const currentData = rateLimitStore.get(key);

    if (!currentData || now >= currentData.resetAt) {
      // Start a new window
      rateLimitStore.set(key, { count: 1, resetAt });

      return {
        allowed: true,
        remaining: options.requests - 1,
        resetAt,
        limit: options.requests,
      };
    }

    // Check if limit exceeded
    if (currentData.count >= options.requests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: currentData.resetAt,
        limit: options.requests,
      };
    }

    // Increment counter
    currentData.count++;

    return {
      allowed: true,
      remaining: options.requests - currentData.count,
      resetAt: currentData.resetAt,
      limit: options.requests,
    };
  }

  async getRemainingAttempts(
    identifier: string,
    endpoint: string,
    options: RateLimitOptions
  ): Promise<number> {
    const key = this.getKey(identifier, endpoint);
    const currentData = rateLimitStore.get(key);

    if (!currentData || Date.now() >= currentData.resetAt) {
      return options.requests;
    }

    return Math.max(0, options.requests - currentData.count);
  }
}

// Global edge-safe rate limiter instance
const edgeSafeRateLimiter = new EdgeSafeRateLimiter();

export function getEdgeSafeRateLimiter(): EdgeSafeRateLimiter {
  return edgeSafeRateLimiter;
}

// Helper function to get rate limit configuration for an endpoint type
export function getRateLimitConfig(type: keyof typeof securityConfig.rateLimits): RateLimitOptions {
  const config = securityConfig.rateLimits[type] || securityConfig.rateLimits.public;
  return {
    requests: config.max,
    window: Math.floor(config.windowMs / 1000), // Convert to seconds
  };
}
