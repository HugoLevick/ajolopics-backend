import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@gmail.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
