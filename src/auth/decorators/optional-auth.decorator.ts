import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesEnum } from '../enums/roles.enum';
import { RoleProtected } from './role-protected.decorator';
import { OptionalJwtAuthGuard } from '../guards/optional-jwt-auth.guard';
import { UserRoleGuard } from '../guards/user-role.guard';

export function OptionalAuth(...roles: RolesEnum[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(OptionalJwtAuthGuard, UserRoleGuard),
  );
}
