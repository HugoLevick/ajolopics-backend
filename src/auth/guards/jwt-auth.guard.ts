import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    const req = context.switchToHttp().getRequest();

    const user: User = req.user;
    if (!user) throw new UnauthorizedException();

    if (!validRoles || validRoles.length === 0) return true;

    if (validRoles.includes(user.role)) return true;

    throw new ForbiddenException(`User ${user.name} needs a valid role`);
  }
}
