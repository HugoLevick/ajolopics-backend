import { Asset } from 'src/assets/entities/asset.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Asset, (asset) => asset.post, { nullable: false })
  assets: Asset[];

  @Column('varchar', { length: 255, nullable: false })
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;
}
