import express, { Request, Response } from 'express';
import Redis from 'ioredis';

const app = express(); // ✅ THIS LINE MUST NOT HAVE ANY ARGUMENTS
const port = 3002;

const redis = new Redis({
  host: 'redis',
  port: 6379,
});

app.get('/:shortId', async (req: Request, res: Response) => {
  const { shortId } = req.params;

  if (!shortId) {
    return res.status(400).json({ error: 'no shortId provided' });
  }

  const longUrl = await redis.get(shortId);

  if (!longUrl) {
    return res.status(404).json({ error: 'shortId not found' });
  }

  res.redirect(longUrl);
});

app.listen(port, () => {
  console.log(`Redirect service is running on port ${port}`);
});
