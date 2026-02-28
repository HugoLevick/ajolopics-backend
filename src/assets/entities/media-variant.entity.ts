import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Asset } from './asset.entity';

export enum MediaVariantType {
  ORIGINAL = 'ORIGINAL',
  MEDIUM = 'MEDIUM',
  THUMBNAIL = 'THUMBNAIL',
}

@Entity('media_variants')
export class MediaVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, (asset) => asset.variants)
  @JoinColumn({ foreignKeyConstraintName: 'FK_media_variant_asset' })
  asset: Asset;

  @Column('varchar', { length: 511, nullable: false })
  url: string;

  @Column('varchar', { length: 511, nullable: false })
  key: string;

  @Column('enum', {
    enum: MediaVariantType,
    nullable: false,
  })
  variant: MediaVariantType;

  @Column('int', { nullable: false })
  width: number;

  @Column('int', { nullable: false })
  height: number;

  @Column('bigint', { nullable: false })
  size: number;

  @Column('varchar', { length: 255, nullable: false })
  mimeType: string;
}
