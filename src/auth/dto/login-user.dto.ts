import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { AuthErrorDefinitions } from '../error-definitions';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@gmail.com',
  })
  @IsString({ message: AuthErrorDefinitions.INVALID_EMAIL_FORMAT.errorCode })
  @IsEmail({}, { message: AuthErrorDefinitions.INVALID_EMAIL_FORMAT.errorCode })
  @MaxLength(255, {
    message: AuthErrorDefinitions.INVALID_EMAIL_LENGTH.errorCode,
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString({ message: AuthErrorDefinitions.INVALID_PASSWORD_FORMAT.errorCode })
  @Length(8, 255, {
    message: AuthErrorDefinitions.INVALID_PASSWORD_LENGTH.errorCode,
  })
  password: string;
}
