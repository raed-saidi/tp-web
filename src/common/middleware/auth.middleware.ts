import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['auth-user'];

    if (!token) {
      throw new UnauthorizedException('Missing auth-user header');
    }

    try {
      const decoded = verify(token as string, 'your-secret-key') as {
        userId: number;
      };

      if (!decoded.userId) {
        throw new UnauthorizedException('Token does not contain userId');
      }

      req.userId = decoded.userId;
      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
