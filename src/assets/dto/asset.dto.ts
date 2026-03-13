import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MediaVariantDto } from './media-variant.dto';

export class AssetDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  filename: string;

  @Expose()
  @ApiProperty({
    description: 'Position of the asset in the post',
  })
  position: number;

  @Expose()
  @Type(() => MediaVariantDto)
  @ApiProperty({ type: () => [MediaVariantDto] })
  variants: MediaVariantDto[];
}
