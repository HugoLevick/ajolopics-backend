import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';
import { AuthErrorDefinitions } from '../error-definitions';

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
