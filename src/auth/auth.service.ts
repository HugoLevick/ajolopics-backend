import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthErrorDefinitions } from './error-codes';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const email = registerUserDto.email.trim();
    await this.verifyNotRegistered(email);

    const name = registerUserDto.name.trim();

    try {
      const user = await this.usersService.create({
        email,
        name,
        password: bcrypt.hashSync(registerUserDto.password, 10),
      });
      delete user.password;
      return user;
    } catch (error) {
      this.handleDbError(error);
      // Unknown error
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async verifyNotRegistered(email: string) {
    const existingUser = await this.usersService.findOneBy({ email });
    if (existingUser) {
      throw AuthErrorDefinitions.EMAIL_ALREADY_REGISTERED.build(400);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const email = loginUserDto.email.trim();
    const password = loginUserDto.password;

    const user = await this.usersService.findOneBy({ email });

    if (!user) {
      throw AuthErrorDefinitions.INVALID_CREDENTIALS.build(400);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw AuthErrorDefinitions.INVALID_CREDENTIALS.build(400);
    }

    const payload: AuthJwtPayload = {
      userId: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private handleDbError(error: any) {
    if (error?.detail?.includes('already exists')) {
      throw AuthErrorDefinitions.EMAIL_ALREADY_REGISTERED.build(400);
    }
  }
}
