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
    const { originalUrl } = req.body;
    if (!originalUrl){
        return res.status(400).json({ error: 'originalUrl is required' })
    }

    const shortId = nanoid(6);
    await redis.set(shortId, originalUrl);

    res.json({ shortUrl: `${req.protocol}://${req.hostname}/${shortId}`, shortId });
});

app.listen(port, () => {
    console.log('API service is running on port', port);
});