import { Request, Response, NextFunction } from 'express';

// TODO: implement proper JWT verification
export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
    // const token = req.headers.authorization?.split(' ')[1];
    // if (!token) return res.status(401).json({ error: 'no token' });
    next();
}
