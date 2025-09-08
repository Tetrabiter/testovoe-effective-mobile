import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded as { userId: number; email: string; role: string };
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Middleware для проверки, что пользователь запрашивает свои данные или он админ
export const requireSelfOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const requestedUserId = parseInt(req.params.id);
  if (req.user?.role !== 'ADMIN' && req.user?.userId !== requestedUserId) {
    return res.status(403).json({ message: 'Access denied. Can only access your own data.' });
  }
  next();
};