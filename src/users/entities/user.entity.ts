import { Exclude } from 'class-transformer';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

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
