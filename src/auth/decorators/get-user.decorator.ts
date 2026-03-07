import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

type GetUserProperty = keyof User;

interface GetUserOptions {
  key?: GetUserProperty;
  optional?: boolean;
}

type GetUserData = GetUserProperty | GetUserOptions | undefined;

const isGetUserOptions = (data: GetUserData): data is GetUserOptions => {
  return typeof data === 'object' && data !== null;
};

export const GetUser = createParamDecorator((data: GetUserData, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user as User | undefined;

  const options = isGetUserOptions(data) ? data : undefined;
  const key = options?.key ?? (typeof data === 'string' ? data : undefined);
  const isOptional = options?.optional ?? false;

  if (!user) {
    if (isOptional) {
      return key ? undefined : null;
    }

    throw new InternalServerErrorException('User not found (request)');
  }

  return key ? user[key] : user;
});
