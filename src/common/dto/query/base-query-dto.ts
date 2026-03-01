import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

// Define an enum for ordering options
export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BaseQueryOrderDto {
  @ApiPropertyOptional({
    type: String,
    example: 'DESC',
    enum: OrderDirection,
    default: OrderDirection.DESC,
    description: 'Order direction of the column',
  })
  @IsOptional()
  @IsEnum(OrderDirection)
  direction: OrderDirection = OrderDirection.DESC;

  column: string; //* Each dto will define its own columns
}

// Base DTO for pagination, sorting, and search
export class BasePaginatedQueryDto<T = any> {
  @ApiPropertyOptional({
    type: Number,
    example: 1,
    minimum: 1,
    default: 1,
    description: 'The page number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number = 1;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    minimum: 1,
    default: 10,
    description: 'The number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  size: number = 10;

  @ApiPropertyOptional({
    type: String,
    example: 'Condo #2',
    minimum: 1,
    maximum: 1000,
    description: 'Search that will be applied to searchable columns',
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  search?: string;

  @ApiPropertyOptional({
    type: BaseQueryOrderDto,
    description: 'Order results options',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BaseQueryOrderDto)
  order: BaseQueryOrderDto = new BaseQueryOrderDto();
}
