/**
 * In-memory rate limiter for post creation
 * Tracks posts per anonymous ID to prevent abuse
 */

interface RateLimitEntry {
  timestamps: number[]; // Array of post creation timestamps
}

// In-memory store: anonId -> RateLimitEntry
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const MAX_POSTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Check if an anonymous ID has exceeded the rate limit
 * @param anonId - Anonymous user ID
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(anonId: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(anonId);

  if (!entry) {
    // First post for this user - allow it
    rateLimitStore.set(anonId, { timestamps: [now] });
    return {
      allowed: true,
      remaining: MAX_POSTS - 1,
      resetAt: now + WINDOW_MS,
    };
  }

  // Remove timestamps outside the current window
  const cutoff = now - WINDOW_MS;
  entry.timestamps = entry.timestamps.filter(ts => ts > cutoff);

  if (entry.timestamps.length >= MAX_POSTS) {
    // Rate limited - find the oldest timestamp to calculate reset time
    const oldestTimestamp = Math.min(...entry.timestamps);
    const resetAt = oldestTimestamp + WINDOW_MS;

    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  // Allow the post - add current timestamp
  entry.timestamps.push(now);
  rateLimitStore.set(anonId, entry);

  return {
    allowed: true,
    remaining: MAX_POSTS - entry.timestamps.length,
    resetAt: now + WINDOW_MS,
  };
}

/**
 * Clean up old entries from the rate limit store
 * Should be called periodically to prevent memory leaks
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  for (const [anonId, entry] of rateLimitStore.entries()) {
    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter(ts => ts > cutoff);

    // Remove entry if no timestamps remain
    if (entry.timestamps.length === 0) {
      rateLimitStore.delete(anonId);
    }
  }
}

/**
 * Get current rate limit status for an anonymous ID (without incrementing)
 * Useful for checking status before attempting to create a post
 */
export function getRateLimitStatus(anonId: string): { remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(anonId);

  if (!entry) {
    return {
      remaining: MAX_POSTS,
      resetAt: now + WINDOW_MS,
    };
  }

  // Remove timestamps outside the current window
  const cutoff = now - WINDOW_MS;
  entry.timestamps = entry.timestamps.filter(ts => ts > cutoff);

  if (entry.timestamps.length === 0) {
    rateLimitStore.delete(anonId);
    return {
      remaining: MAX_POSTS,
      resetAt: now + WINDOW_MS,
    };
  }

  const oldestTimestamp = Math.min(...entry.timestamps);
  const resetAt = oldestTimestamp + WINDOW_MS;

  return {
    remaining: MAX_POSTS - entry.timestamps.length,
    resetAt,
  };
}

/**
 * Start the rate limiter cleanup interval
 * Should be called from the main server entry point
 */
export function startRateLimiterCleanup(): void {
  if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
  }
}

