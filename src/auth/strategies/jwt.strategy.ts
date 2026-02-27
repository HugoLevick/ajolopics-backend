import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: AuthJwtPayload): Promise<User> {
    const { userId } = payload;

    if (!userId) throw new UnauthorizedException('Token not valid');

    const user = this.usersService.findOneBy({ id: userId });

    if (!user) throw new UnauthorizedException('Token not valid');

    return user;
  }
}
