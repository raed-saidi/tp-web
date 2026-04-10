import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import {
  AuthMiddleware,
  AUTH_USER_HEADER,
  AUTH_USER_SECRET,
} from './auth.middleware';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new AuthMiddleware();
    req = { headers: {} };
    res = {};
    next = jest.fn();
  });

  it('injects userId from a valid JWT', () => {
    req.headers = {
      [AUTH_USER_HEADER]: sign({ userId: 5 }, AUTH_USER_SECRET),
    };

    middleware.use(req as Request, res as Response, next);

    expect(req.userId).toBe(5);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('rejects requests without auth-user header', () => {
    expect(() => middleware.use(req as Request, res as Response, next)).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects tokens without userId', () => {
    req.headers = {
      [AUTH_USER_HEADER]: sign({ scope: 'cv:write' }, AUTH_USER_SECRET),
    };

    expect(() => middleware.use(req as Request, res as Response, next)).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects invalid tokens', () => {
    req.headers = {
      [AUTH_USER_HEADER]: 'not-a-jwt',
    };

    expect(() => middleware.use(req as Request, res as Response, next)).toThrow(
      UnauthorizedException,
    );
  });
});
