import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
} from 'class-validator';

export enum AspectRatioEnum {
  LANDSCAPE = 'LANDSCAPE',
  PORTRAIT = 'PORTRAIT',
  SQUARE = 'SQUARE',
}

export class FeedFiltersDto {
  @IsOptional()
  @IsArray()
  @IsInt({
    each: true,
  })
  @ArrayMinSize(1)
  @ArrayMaxSize(20) // Arbitrary limit to prevent abuse, can be adjusted as needed
  @ApiPropertyOptional({
    type: Number,
    isArray: true,
    example: [2, 5, 8],
    description: 'List of tags that feed must have',
    minLength: 1,
    maxLength: 20,
  })
  tagIds?: number[];

  @IsOptional()
  @IsEnum(AspectRatioEnum)
  @ApiPropertyOptional({
    enum: AspectRatioEnum,
    example: AspectRatioEnum.SQUARE,
    description: 'Filter feed by aspect ratio of the original media',
  })
  aspectRatio: AspectRatioEnum;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(20) // Arbitrary limit to prevent abuse, can be adjusted as needed
  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    isArray: true,
    example: [
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    ],
    description: 'List of author IDs to filter by',
    minLength: 1,
    maxLength: 20,
  })
  authorIds?: string[];
}
