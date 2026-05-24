import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';
import { AuthErrorDefinitions } from '../error-definitions';
import {
  normalizeUsername,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from 'src/users/username.utils';

export class RegisterUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    minLength: 3,
    maxLength: 255,
  })
  @IsString({ message: AuthErrorDefinitions.INVALID_NAME_FORMAT.errorCode })
  @Length(3, 255, {
    message: AuthErrorDefinitions.INVALID_NAME_LENGTH.errorCode,
  })
  name: string;

  @ApiProperty({
    description: 'The unique username of the user',
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

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@gmail.com',
    maxLength: 255,
  })
  @IsString({ message: AuthErrorDefinitions.INVALID_EMAIL_FORMAT.errorCode })
  @MaxLength(255, {
    message: AuthErrorDefinitions.INVALID_EMAIL_LENGTH.errorCode,
  })
  @IsEmail({}, { message: AuthErrorDefinitions.INVALID_EMAIL_FORMAT.errorCode })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Welcome1',
    minLength: 8,
    maxLength: 255,
  })
  @IsString({ message: AuthErrorDefinitions.INVALID_PASSWORD_FORMAT.errorCode })
  @Length(8, 255, {
    message: AuthErrorDefinitions.INVALID_PASSWORD_LENGTH.errorCode,
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: AuthErrorDefinitions.INVALID_PASSWORD_FORMAT.errorCode,
  })
  password: string;
}
