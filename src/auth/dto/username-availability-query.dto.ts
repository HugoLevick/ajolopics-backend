import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';
import { AuthErrorDefinitions } from '../error-definitions';
import {
  normalizeUsername,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from 'src/users/username.utils';

export class UsernameAvailabilityQueryDto {
  @ApiProperty({
    description: 'The username to check for availability',
    example: 'john.doe',
    minLength: USERNAME_MIN_LENGTH,
    maxLength: USERNAME_MAX_LENGTH,
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? normalizeUsername(value) : value,
  )
  @IsString({ message: AuthErrorDefinitions.INVALID_USERNAME_FORMAT.errorCode })
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, {
    message: AuthErrorDefinitions.INVALID_USERNAME_LENGTH.errorCode,
  })
  @Matches(USERNAME_REGEX, {
    message: AuthErrorDefinitions.INVALID_USERNAME_FORMAT.errorCode,
  })
  username: string;
}
