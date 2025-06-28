import { error } from 'console';
import { Request, Response, NextFunction } from 'express';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if(!apiKey || apiKey !== process.env.API_KEY){
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
}