import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/jwt-payload.interface';

const JWT_SECRET =
  process.env.jwt_secret ??
  process.env.JWT_SECRET ??
  process.env.SECRET_KEY ??
  'dev-jwt-secret';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    const payload: JwtPayload = this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
    request.user = payload;
    return true;
  }
}
