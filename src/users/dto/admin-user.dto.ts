import { Expose } from 'class-transformer';
import { RolesEnum } from 'src/auth/enums/roles.enum';

export class AdminUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: RolesEnum;
}
