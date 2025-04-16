import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

// Cache duration constants
export const CACHE_TIMES = {
  SEARCH: 1800, // 30 minutes
  LISTING_DETAIL: 86400, // 24 hours
  HOME_PAGE: 900, // 15 minutes
  USER_PROFILE: 3600, // 1 hour
  USER_LISTINGS: 1800, // 30 minutes
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.error("Redis error", error);
    return null;
  }
};

export const setCache = async (key, data, expiry = 3600) => {
  try {
    await redis.setex(key, expiry, JSON.stringify(data));
  } catch (error) {
    console.error("Redis error", error);
    return null;
  }
};

export const invalidateCache = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);

    if (keys?.length > 0) {
      // Delete keys one by one
      const deletePromises = keys.map(async (key) => {
        const deleted = await redis.del(key);
        return deleted === 1;
      });

      const results = await Promise.all(deletePromises);
      const successCount = results.filter(Boolean).length;

      // Verify no keys remain
      const remainingKeys = await redis.keys(pattern);
      if (remainingKeys.length > 0) {
        console.error("Some keys still exist:", remainingKeys);
        return false;
      }

      return true;
    }

    return true; // No keys to delete is considered success
  } catch (error) {
    console.error("Redis error", error);
    return null;
  }
};

export const keyBuilder = {
  listings: {
    search: (query) => `string:listings:search:${JSON.stringify(query)}`,
    searchInvalidate: () => `string:listings:search:*`,
    details: (id) => `string:listing:${id}:details`,
    featured: () => `zset:listings:featured`,
  },
  users: {
    listings: (userId) => `string:users:${userId}:listings`,
    listingsInvalidate: () => `string:users:*:listings`,
  },
};
