import { RolesEnum } from 'src/auth/enums/roles.enum';
import { UserPost } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { USERNAME_MAX_LENGTH } from '../username.utils';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => UserPost, (post) => post.author)
  posts: UserPost[];

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', {
    length: USERNAME_MAX_LENGTH,
    nullable: false,
    unique: true,
  })
  username: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('enum', {
    enum: RolesEnum,
    default: RolesEnum.USER,
  })
  role: RolesEnum;
}
