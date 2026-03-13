import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MediaVariantType } from '../entities/media-variant.entity';

export class MediaVariantDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  url: string;

  @Expose()
  @ApiProperty({ enum: MediaVariantType })
  variant: MediaVariantType;

  @Expose()
  @ApiProperty()
  width: number;

  @Expose()
  @ApiProperty()
  height: number;

  @Expose()
  @ApiProperty()
  size: number;

  @Expose()
  @ApiProperty()
  mimeType: string;
}