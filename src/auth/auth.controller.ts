import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
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
  async checkUsernameAvailability(@Query() query: UsernameAvailabilityQueryDto) {
    return this.authService.checkUsernameAvailability(query.username);
  }

  @Auth()
  @ApiBearerAuth()
  @Get('verify')
  async verify(@GetUser() user: User) {
    return user;
  }
}
