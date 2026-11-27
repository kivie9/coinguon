/**
 * Bộ giới hạn tần suất (Rate Limiter) nhẹ theo cửa sổ trượt trong bộ nhớ.
 * Tương thích với cả Node.js và Cloudflare Workers / Edge Runtime.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
}

export function checkRateLimit(
    key: string,
    maxRequests = 10,
    windowMs = 60_000
): RateLimitResult {
    const now = Date.now();

    // Dọn dẹp nhẹ khi map quá lớn
    if (store.size > 1000) {
        for (const [k, entry] of store.entries()) {
            if (entry.resetAt <= now) store.delete(k);
        }
    }

    const existing = store.get(key);
    if (!existing || existing.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return {
            allowed: true,
            remaining: maxRequests - 1,
            retryAfterSeconds: Math.ceil(windowMs / 1000),
        };
    }

    if (existing.count >= maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
        };
    }

    existing.count += 1;
    return {
        allowed: true,
        remaining: Math.max(0, maxRequests - existing.count),
        retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
}
