import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const request: Request = context.switchToHttp().getRequest();
    const user: User | undefined = request.user as User | undefined;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied (admin only)');
    }

    return true;
  }
}
