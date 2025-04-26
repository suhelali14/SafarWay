import Redis from 'ioredis';

// Initialize Redis client with better error handling and connection options
let redisClient: Redis | null = null;

try {
  redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
    // Don't crash when Redis is down, just log the error
  });

  redisClient.on('connect', () => {
    console.info('Successfully connected to Redis');
  });
} catch (err) {
  console.error('Failed to initialize Redis client:', err);
}

// Optimized Cache TTL (in seconds)
const PACKAGE_CACHE_TTL = 3600; // 1 hour instead of 60 seconds
const PACKAGE_LIST_CACHE_TTL = 900; // 15 minutes instead of 30 seconds
const REVIEWS_CACHE_TTL = 1800; // 30 minutes instead of 5 minutes
const AGENCY_CACHE_TTL = 3600; // 1 hour (unchanged)
const SIMILAR_PACKAGES_CACHE_TTL = 3600; // 1 hour instead of 2 minutes

// Cache keys
const getPackageKey = (id: string) => `package:${id}`;
const getPackageDetailsKey = (id: string) => `package:${id}:details`;
const getPackageReviewsKey = (id: string) => `package:${id}:reviews`;
const getPackageAgencyKey = (id: string) => `package:${id}:agency`;
const getSimilarPackagesKey = (id: string) => `package:${id}:similar`;
const getPackageListKey = (filters: string) => `packages:list:${filters}`;

// Safe Redis operations that won't crash if Redis is unavailable
const safeRedisOperation = async <T>(operation: () => Promise<T>, fallback: T): Promise<T> => {
  if (!redisClient) return fallback;
  
  try {
    return await operation();
  } catch (error) {
    console.error('Redis operation failed:', error);
    return fallback;
  }
};

/**
 * Cache utilities for package data
 */
export const packageCache = {
  /**
   * Set package basic data in cache
   */
  async setPackage(id: string, data: any): Promise<void> {
    await safeRedisOperation(async () => {
      if (!redisClient) return;
      
      await redisClient.set(
        getPackageKey(id),
        JSON.stringify(data),
        'EX',
        PACKAGE_CACHE_TTL
      );
    }, undefined);
  },

  /**
   * Get package basic data from cache
   */
  async getPackage(id: string): Promise<any | null> {
    return safeRedisOperation(async () => {
      if (!redisClient) return null;
      
      const cachedData = await redisClient.get(getPackageKey(id));
      if (!cachedData) return null;
      
      try {
        return JSON.parse(cachedData);
      } catch (error) {
        console.error('Error parsing cached package data:', error);
        return null;
      }
    }, null);
  },

  /**
   * Set package details in cache
   */
  async setPackageDetails(id: string, data: any): Promise<void> {
    await safeRedisOperation(async () => {
      if (!redisClient) return;
      
      await redisClient.set(
        getPackageDetailsKey(id),
        JSON.stringify(data),
        'EX',
        PACKAGE_CACHE_TTL
      );
    }, undefined);
  },

  /**
   * Get package details from cache
   */
  async getPackageDetails(id: string): Promise<any | null> {
    return safeRedisOperation(async () => {
      if (!redisClient) return null;
      
      const cachedData = await redisClient.get(getPackageDetailsKey(id));
      if (!cachedData) return null;
      
      try {
        return JSON.parse(cachedData);
      } catch (error) {
        console.error('Error parsing cached package details:', error);
        return null;
      }
    }, null);
  },

  /**
   * Set package reviews in cache
   */
  async setPackageReviews(id: string, data: any): Promise<void> {
    await safeRedisOperation(async () => {
      if (!redisClient) return;
      
      await redisClient.set(
        getPackageReviewsKey(id),
        JSON.stringify(data),
        'EX',
        REVIEWS_CACHE_TTL
      );
    }, undefined);
  },

  /**
   * Get package reviews from cache
   */
  async getPackageReviews(id: string): Promise<any | null> {
    return safeRedisOperation(async () => {
      if (!redisClient) return null;
      
      const cachedData = await redisClient.get(getPackageReviewsKey(id));
      if (!cachedData) return null;
      
      try {
        return JSON.parse(cachedData);
      } catch (error) {
        console.error('Error parsing cached package reviews:', error);
        return null;
      }
    }, null);
  },

  /**
   * Set package agency data in cache
   */
  async setPackageAgency(id: string, data: any): Promise<void> {
    await safeRedisOperation(async () => {
      if (!redisClient) return;
      
      await redisClient.set(
        getPackageAgencyKey(id),
        JSON.stringify(data),
        'EX',
        AGENCY_CACHE_TTL
      );
    }, undefined);
  },

  /**
   * Get package agency data from cache
   */
  async getPackageAgency(id: string): Promise<any | null> {
    return safeRedisOperation(async () => {
      if (!redisClient) return null;
      
      const cachedData = await redisClient.get(getPackageAgencyKey(id));
      if (!cachedData) return null;
      
      try {
        return JSON.parse(cachedData);
      } catch (error) {
        console.error('Error parsing cached package agency data:', error);
        return null;
      }
    }, null);
  },

  /**
   * Set similar packages in cache
   */
  async setSimilarPackages(id: string, data: any): Promise<void> {
    await safeRedisOperation(async () => {
      if (!redisClient) return;
      
      await redisClient.set(
        getSimilarPackagesKey(id),
        JSON.stringify(data),
        'EX',
        SIMILAR_PACKAGES_CACHE_TTL
      );
    }, undefined);
  },

  /**
   * Get similar packages from cache
   */
  async getSimilarPackages(id: string): Promise<any | null> {
    return safeRedisOperation(async () => {
      if (!redisClient) return null;
      
      const cachedData = await redisClient.get(getSimilarPackagesKey(id));
      if (!cachedData) return null;
      
      try {
        return JSON.parse(cachedData);
      } catch (error) {
        console.error('Error parsing cached similar packages:', error);
        return null;
      }
    }, null);
  },

  /**
   * Set package list in cache
   */
  async setPackageList(filters: string, data: any): Promise<void> {
    await safeRedisOperation(async () => {
      if (!redisClient) return;
      
      await redisClient.set(
        getPackageListKey(filters),
        JSON.stringify(data),
        'EX',
        PACKAGE_LIST_CACHE_TTL
      );
    }, undefined);
  },

  /**
   * Get package list from cache
   */
  async getPackageList(filters: string): Promise<any | null> {
    return safeRedisOperation(async () => {
      if (!redisClient) return null;
      
      const cachedData = await redisClient.get(getPackageListKey(filters));
      if (!cachedData) return null;
      
      try {
        return JSON.parse(cachedData);
      } catch (error) {
        console.error('Error parsing cached package list:', error);
        return null;
      }
    }, null);
  },

  /**
   * Invalidate package cache
   */
  async invalidatePackage(id: string): Promise<void> {
    await safeRedisOperation(async () => {
      if (!redisClient) return;
      
      await redisClient.del(
        getPackageKey(id),
        getPackageDetailsKey(id),
        getPackageReviewsKey(id),
        getPackageAgencyKey(id),
        getSimilarPackagesKey(id)
      );
    }, undefined);
  },

  /**
   * Invalidate package list cache
   */
  async invalidatePackageList(): Promise<void> {
    await safeRedisOperation(async () => {
      if (!redisClient) return;
      
      const keys = await redisClient.keys('packages:list:*');
      if (keys.length) {
        await redisClient.del(...keys);
      }
    }, undefined);
  }
};

export default packageCache; 