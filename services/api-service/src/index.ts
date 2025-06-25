import express, { Request, Response } from 'express';
import { error } from 'console';
import Redis from 'ioredis';
import { nanoid } from 'nanoid';

const app = express();
const port = 3001;
const redis = new Redis({
    host: 'redis',
    port: 6379,
});
app.use(express.json());
app.post('/shorten', async (req: Request, res: Response) => {
    const MAX_EXPIRY = 7 * 24 * 60 * 60; // 7 days
    const ip = req.ip;
    console.log('Received request from IP:', ip);
    const rateLimitKey = `rate_limit:${ip}`;
    const currentKeyCount = await redis.incr(rateLimitKey);
    if( currentKeyCount === 1 ){
        await redis.expire(rateLimitKey, 120);
    }
    if( currentKeyCount > 10 ){
        return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }

    const { originalUrl, expiry } = req.body;
    if (!originalUrl){
        return res.status(400).json({ error: 'originalUrl is required' })
    }

    const shortId = nanoid(6);

    if(expiry){
        console.log('expiry', expiry, typeof expiry);
        if(typeof expiry !== 'number' || expiry <= 0)
            return res.status(400).json({ error: 'expiry must be a positive number' });

        if(expiry > MAX_EXPIRY)
            return res.status(400).json({ error: 'expiry must not be more than 7 days' });

        await redis.set(shortId, originalUrl, 'EX', expiry);
    }
    else
        await redis.set(shortId, originalUrl);

    res.json({ shortUrl: `${req.protocol}://${req.hostname}/${shortId}`, shortId });
});

app.listen(port, () => {
    console.log('API service is running on port', port);
});