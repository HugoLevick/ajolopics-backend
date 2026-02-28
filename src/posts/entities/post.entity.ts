import { Asset } from 'src/assets/entities/asset.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Asset, (asset) => asset.post, { nullable: false })
  assets: Asset[];

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

  @Column('varchar', { length: 255, nullable: false })
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;
}
