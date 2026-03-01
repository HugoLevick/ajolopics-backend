import { ApiProperty } from '@nestjs/swagger';
import { Asset } from 'src/assets/entities/asset.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class UserPost {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ foreignKeyConstraintName: 'FK_posts_author_id' })
  author: User;

  @ApiProperty({ type: () => [Asset] })
  @OneToMany(() => Asset, (asset) => asset.post, { nullable: false })
  assets: Asset[];

  @ApiProperty({ type: () => [Tag], required: false })
  @ManyToMany(() => Tag, { nullable: true })
  @JoinTable({
    name: 'post_tags',
    joinColumn: {
      name: 'postId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_post_tags_post_id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_post_tags_tag_id',
    },
  })
  tags?: Tag[];

  @ApiProperty({ type: 'string', maxLength: 255, example: 'My first post' })
  @Column('varchar', { length: 255, nullable: false })
  title: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'This is a description of my first post.',
  })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date;
}
