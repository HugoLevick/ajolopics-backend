import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AssetDto } from 'src/assets/dto/asset.dto';
import { TagDto } from 'src/tags/dto/tag.dto';

export class PostAuthorDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class UserPostDto {
  @Expose()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  @Expose()
  @Type(() => PostAuthorDto)
  @ApiProperty({ type: () => PostAuthorDto })
  author: PostAuthorDto;

  @Expose()
  @Type(() => AssetDto)
  @ApiProperty({ type: () => [AssetDto] })
  assets: AssetDto[];

  @Expose()
  @Type(() => TagDto)
  @ApiProperty({ type: () => [TagDto], required: false })
  tags?: TagDto[];

  @Expose()
  @ApiProperty({
    type: 'string',
    maxLength: 255,
    example: 'My first post',
  })
  title: string;

  @Expose()
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'This is a description of my first post.',
  })
  description?: string;

  @Expose()
  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: Date;
}
