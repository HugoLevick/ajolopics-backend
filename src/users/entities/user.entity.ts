import { Exclude } from 'class-transformer';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('varchar', { length: 255, nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @Column('enum', {
    enum: RolesEnum,
    default: RolesEnum.USER,
  })
  role: RolesEnum;
}
