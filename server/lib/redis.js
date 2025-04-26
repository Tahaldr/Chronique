import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const client = new Redis(process.env.UPSTASH_REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

export default client;
