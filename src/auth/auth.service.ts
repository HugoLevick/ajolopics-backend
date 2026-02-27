import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
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
  async login(loginUserDto: LoginUserDto) {
    const email = loginUserDto.email.trim();
    const password = loginUserDto.password;

    const user = await this.usersService.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
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
      throw new BadRequestException('Email already registered');
    }
  }
}
