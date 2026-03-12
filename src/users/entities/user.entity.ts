import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { UserPost } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => UserPost, (post) => post.author)
  posts: UserPost[];

  @ApiProperty()
  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @ApiProperty()
  @Column('varchar', {
    length: 255,
    nullable: false,
    unique: true,
    select: false,
  })
  email: string;

  @Exclude()
  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @ApiProperty({ enum: RolesEnum, enumName: 'RolesEnum' })
  @Column('enum', {
    enum: RolesEnum,
    default: RolesEnum.USER,
  })
  role: RolesEnum;
}
