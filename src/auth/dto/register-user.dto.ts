import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString({ message: 'Name must be a string' })
  @Length(3, 255, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@gmail.com',
  })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString({ message: 'Password must be a string' })
  @Length(4, 255, { message: 'Password must be at least 4 characters long' })
  password: string;
}
