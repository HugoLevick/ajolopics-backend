import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { normalizeUsername } from 'src/users/username.utils';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthErrorDefinitions } from './error-definitions';
import { AuthJwtPayload } from './interfaces/jwt-payload.interface';

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
    const username = normalizeUsername(registerUserDto.username);
    await this.verifyUsernameAvailable(username);

    try {
      const user = await this.usersService.create({
        email,
        name,
        username,
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

  async checkUsernameAvailability(username: string) {
    const normalizedUsername = normalizeUsername(username);
    const existingUser =
      await this.usersService.findOneByUsername(normalizedUsername);

    return {
      username: normalizedUsername,
      available: !existingUser,
    };
  }

  async verifyNotRegistered(email: string) {
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw AuthErrorDefinitions.EMAIL_ALREADY_REGISTERED.build(400);
    }
  }

  async verifyUsernameAvailable(username: string) {
    const { available } = await this.checkUsernameAvailability(username);
    if (!available) {
      throw AuthErrorDefinitions.USERNAME_ALREADY_TAKEN.build(400);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const email = loginUserDto.email.trim();
    const password = loginUserDto.password;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw AuthErrorDefinitions.INVALID_CREDENTIALS.build(400);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw AuthErrorDefinitions.INVALID_CREDENTIALS.build(400);
    }

    const payload: AuthJwtPayload = {
      userId: user.id,
    };

    const token = this.jwtService.sign(payload);
    const decoded = this.jwtService.decode(token) as { exp?: number };

    return {
      token,
      expiresAt: decoded.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : null,
      expiresIn: decoded.exp
        ? decoded.exp - Math.floor(Date.now() / 1000)
        : null,
    };
  }

  private handleDbError(error: any) {
    if (error?.detail?.includes('already exists')) {
      if (error?.detail?.includes('(username)=')) {
        throw AuthErrorDefinitions.USERNAME_ALREADY_TAKEN.build(400);
      }

      throw AuthErrorDefinitions.EMAIL_ALREADY_REGISTERED.build(400);
    }
  }
}
