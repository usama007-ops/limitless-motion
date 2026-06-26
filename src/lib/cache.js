import { redis } from './redis'

const redisAvailable =
  process.env.UPSTASH_REDIS_URL &&
  process.env.UPSTASH_REDIS_TOKEN &&
  !process.env.UPSTASH_REDIS_URL.includes('your-')

export const TTL = {
  WORKOUT_PROGRAMS: 3600,
  WORKOUT_DAYS: 1800,
  EXERCISES: 1800,
  RECIPES: 3600,
  MEALS: 7200,
  VIDEOS: 3600,
  PODCASTS: 3600,
  AFFIRMATIONS: 600,
  COMMUNITY_POSTS: 300,
  APPAREL: 1800,
  ATTIRE: 3600,
  CHALLENGES: 3600,
  PAYMENT_HISTORY: 120,
  PROFILE: 600,
  MEMBERSHIPS: 300,
}

export async function getOrSet(_key, fetchFn, _ttl = 3600) {
  if (!redisAvailable) return fetchFn()
  const cached = await redis.get(_key)
  if (cached !== null) return cached

  const data = await fetchFn()
  if (data !== null && data !== undefined) {
    await redis.set(_key, JSON.stringify(data), { ex: _ttl })
  }
  return data
}

export function cacheKey(prefix, ...parts) {
  return `lm:${prefix}:${parts.filter(Boolean).join(':')}`
}

export async function invalidatePattern(pattern) {
  let cursor = 0
  do {
    const [nextCursor, keys] = await redis.scan(cursor, { match: pattern, count: 100 })
    if (keys.length > 0) {
      await redis.del(...keys)
    }
    cursor = parseInt(nextCursor, 10)
  } while (cursor !== 0)
}

export async function invalidatePrefix(prefix) {
  await invalidatePattern(`lm:${prefix}:*`)
}
