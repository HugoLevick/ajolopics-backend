import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { UserPost } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => UserPost, (post) => post.author)
  posts: UserPost[];

  @Column('varchar', { length: 255 })
  name: string;

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
