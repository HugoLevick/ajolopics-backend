import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { AuthUserDto } from './dto/auth-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsernameAvailabilityQueryDto } from './dto/username-availability-query.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('username-availability')
  async checkUsernameAvailability(
    @Query() query: UsernameAvailabilityQueryDto,
  ) {
    return this.authService.checkUsernameAvailability(query.username);
  }

  @Auth()
  @ApiBearerAuth()
  @Get('verify')
  async verify(@GetUser() user: User) {
    return plainToInstance(AuthUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
