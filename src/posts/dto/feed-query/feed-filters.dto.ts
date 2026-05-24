import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import {
  normalizeUsername,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from 'src/users/username.utils';

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
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((item) =>
          typeof item === 'string' ? normalizeUsername(item) : item,
        )
      : value,
  )
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, { each: true })
  @Matches(USERNAME_REGEX, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(20) // Arbitrary limit to prevent abuse, can be adjusted as needed
  @ApiPropertyOptional({
    type: String,
    isArray: true,
    example: ['john.doe', 'jane_doe'],
    description: 'List of usernames to filter by',
    minLength: 1,
    maxLength: 20,
  })
  usernames?: string[];
}
