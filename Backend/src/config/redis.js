import redis from 'redis';
import { logger } from '../utils/logger.js';

let redisClient = null;

export const connectRedis = async () => {
  try {
    if (process.env.REDIS_HOST) {
      redisClient = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      });

      redisClient.on('error', (err) => {
        logger.error(`Redis Client Error: ${err.message}`);
      });

      redisClient.on('connect', () => {
        logger.info('Redis Client Connected');
      });

      await redisClient.connect();
      return redisClient;
    } else {
      logger.info('Redis not configured, skipping connection');
      return null;
    }
  } catch (error) {
    logger.error(`Redis connection error: ${error.message}`);
    return null;
  }
};

export const getRedisClient = () => redisClient;

export const cacheData = async (key, data, expiration = 3600) => {
  if (!redisClient) return false;
  try {
    await redisClient.setEx(key, expiration, JSON.stringify(data));
    return true;
  } catch (error) {
    logger.error(`Cache error: ${error.message}`);
    return false;
  }
};

export const getCachedData = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Get cache error: ${error.message}`);
    return null;
  }
};

export const deleteCache = async (key) => {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Delete cache error: ${error.message}`);
    return false;
  }
};

