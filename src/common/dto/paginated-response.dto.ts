import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PaginatedResponseDto<T> {
  @Expose()
  @ApiProperty({ example: 1 })
  page: number;

  @Expose()
  @ApiProperty({ example: 10 })
  size: number;

  @Expose()
  @ApiProperty({ example: 100 })
  totalItems: number;

  @Expose()
  @ApiProperty({
    example: 10,
    description: 'Total pages calculated from totalItems and limit',
  })
  totalPages: number;

  @Expose()
  @ApiProperty({ example: true, description: 'Whether there is a next page' })
  hasNextPage: boolean;

  @Expose()
  @ApiProperty({
    example: false,
    description: 'Whether there is a previous page',
  })
  hasPreviousPage: boolean;

  @Expose()
  @ApiProperty({ isArray: true, type: Object })
  items: T[];

  constructor(partial: Partial<PaginatedResponseDto<T>>) {
    Object.assign(this, partial);
    this.totalPages = this.totalPages ?? Math.ceil(this.totalItems / this.size);
    this.hasNextPage = this.hasNextPage ?? this.page < this.totalPages;
    this.hasPreviousPage = this.hasPreviousPage ?? this.page > 1;

    // if (this.page > this.totalPages && this.page !== 1)
    //   throw new BadRequestException('Invalid page');
  }
}
