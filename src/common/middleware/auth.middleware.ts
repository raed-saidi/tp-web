import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

export const AUTH_USER_HEADER = 'auth-user';
export const AUTH_USER_SECRET =
  process.env.JWT_SECRET ?? process.env.AUTH_USER_SECRET ?? 'your-secret-key';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers[AUTH_USER_HEADER];

    if (!token) {
      throw new UnauthorizedException(`Missing ${AUTH_USER_HEADER} header`);
    }

    try {
      const rawToken = Array.isArray(token) ? token[0] : token;
      const bearerToken = rawToken.startsWith('Bearer ')
        ? rawToken.slice('Bearer '.length)
        : rawToken;
      const decoded = verify(bearerToken, AUTH_USER_SECRET);
      const userId = this.extractUserId(decoded);

      if (userId === undefined) {
        throw new UnauthorizedException('Token does not contain userId');
      }

      req.userId = userId;
      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractUserId(decoded: string | JwtPayload): number | undefined {
    if (typeof decoded === 'string') {
      return undefined;
    }

    const { userId } = decoded;
    if (
      typeof userId !== 'number' ||
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return undefined;
    }

    return userId;
  }
}
