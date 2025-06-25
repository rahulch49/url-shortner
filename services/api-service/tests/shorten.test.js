const request = require('supertest');
const express = require('express');
const Redis = require('ioredis');
const { nanoid } = require('nanoid');

const app = express();
app.use(express.json());

const redis = new Redis({
  host: 'localhost', // <-- Because test runs outside Docker
  port: 6379,
});

app.post('/shorten', async (req, res) => {
  const { originalUrl, expiry } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  const shortId = nanoid(6);
  await redis.set(shortId, originalUrl);
  if (expiry) {
    await redis.expire(shortId, expiry);
  }

  res.json({ shortUrl: `${req.protocol}://${req.hostname}/${shortId}`, shortId });
});

describe('POST /shorten', () => {
  it('should return a shortUrl and shortId for valid originalUrl', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'https://youtube.com' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body).toHaveProperty('shortId');
  });

  it('should return 400 if originalUrl is missing', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'originalUrl is required');
  });
});
