import { Expose } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';
import { RolesEnum } from '../enums/roles.enum';

export class AuthUserDto extends UserDto {
  @Expose()
  email: string;

  @Expose()
  role: RolesEnum;
}
