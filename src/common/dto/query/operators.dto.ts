import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  Length,
  Min,
  IsDate,
  IsPositive,
} from 'class-validator';
import { TransformToDate } from 'src/common/decorators/transform-to-date.decorator';

export class DateOperatorDto {
  @ApiPropertyOptional({
    type: Date,
    format: 'ISO 8601',
    example: '2025-01-01',
    description: 'Filter for dates greater than this value',
  })
  @IsOptional()
  @TransformToDate()
  @IsDate({ message: 'greaterThan must be a valid ISO 8601 date' })
  greaterThan?: Date;

  @ApiPropertyOptional({
    type: Date,
    format: 'ISO 8601',
    example: '2025-01-01',
    description: 'Filter for dates less than this value',
  })
  @IsOptional()
  @TransformToDate()
  @IsDate({ message: 'lessThan must be a valid ISO 8601 date' })
  lessThan?: Date;

  @ApiPropertyOptional({
    type: Date,
    format: 'ISO 8601',
    example: '2025-01-01',
    description: 'Exact match for a specific date',
  })
  @IsOptional()
  @TransformToDate()
  @IsDate({ message: 'equals must be a valid ISO 8601 date' })
  equals?: Date;
}

export class IntegerOperatorDto {
  @ApiPropertyOptional({
    type: Number,
    example: 10,
    description: 'Greater than value',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  greaterThan?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 5,
    description: 'Less than value',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  lessThan?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 100,
    description: 'Exact match value',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  equals?: number;
}

export class StringOperatorDto {
  @ApiPropertyOptional({
    type: String,
    minimum: 0,
    maximum: 1000,
    example: 'some text',
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  equals: string;

  @ApiPropertyOptional({
    type: String,
    minimum: 0,
    maximum: 350,
  })
  @IsOptional()
  @IsString()
  @Length(0, 350)
  like: string;
}
