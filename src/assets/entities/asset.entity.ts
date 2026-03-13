import { UserPost } from 'src/posts/entities/post.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MediaVariant } from './media-variant.entity';

@Entity('assets')
@Index('idx_uq_asset_post_position', ['post', 'position'], { unique: true })
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserPost, (post) => post.assets)
  @JoinColumn({ foreignKeyConstraintName: 'FK_asset_post' })
  post: UserPost;

  @Column('varchar', { length: 255 })
  filename: string;

  @Column('smallint', { default: 0 })
  position: number; // for ordering images

  @OneToMany(() => MediaVariant, (variant) => variant.asset, {
    cascade: ['insert'],
  })
  variants: MediaVariant[];
}
