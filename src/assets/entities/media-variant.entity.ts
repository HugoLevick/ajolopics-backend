import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Asset } from './asset.entity';

export enum MediaVariantType {
  ORIGINAL = 'ORIGINAL',
  MEDIUM = 'MEDIUM',
  THUMBNAIL = 'THUMBNAIL',
}

@Entity('media_variants')
export class MediaVariant {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, (asset) => asset.variants)
  @JoinColumn({ foreignKeyConstraintName: 'FK_media_variant_asset' })
  asset: Asset;

  @ApiProperty()
  @Column('varchar', { length: 511, nullable: false })
  url: string;

  @ApiProperty()
  @Column('varchar', { length: 511, nullable: false })
  key: string;

  @ApiProperty({ enum: MediaVariantType })
  @Column('enum', {
    enum: MediaVariantType,
    nullable: false,
  })
  variant: MediaVariantType;

  @ApiProperty()
  @Column('int', { nullable: false })
  width: number;

  @ApiProperty()
  @Column('int', { nullable: false })
  height: number;

  @ApiProperty()
  @Column('bigint', { nullable: false })
  size: number;

  @ApiProperty()
  @Column('varchar', { length: 255, nullable: false })
  mimeType: string;
}
