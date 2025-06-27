import express, { Request, Response } from 'express';
import Redis from 'ioredis';
import { logger } from './logger';

const app = express();
const port = 3002;

const redis = new Redis({
  host: 'redis',
  port: 6379,
});

app.get('/:shortId', async (req: Request, res: Response) => {
  const { shortId } = req.params;

  if (!shortId) {
    logger.error(`No shortId provided.`);
    return res.status(400).json({ error: 'no shortId provided' });
  }

  const longUrl = await redis.get(shortId);

  if (!longUrl) {
    logger.warn(`shortId not found: ${shortId}`);
    return res.status(404).json({ error: 'shortId not found' });
  }
  logger.info(`Redirecting shortId: ${shortId} to longUrl: ${longUrl}`);

  await redis.incr(`click_count:${shortId}`);

  res.redirect(longUrl);
});

app.get('/analytics/:shortId', async (req: Request, res: Response) => {
  const { shortId } = req.params;
  if (!shortId) {
    return res.status(400).json({ error: 'no shortId provided' });
  }

  const clickCount = await redis.get(`click_count:${shortId}`);

  res.json({ shortId, clickCount: parseInt(clickCount ?? '0', 10) });
});

app.listen(port, () => {
  console.log(`Redirect service is running on port ${port}`);
});
