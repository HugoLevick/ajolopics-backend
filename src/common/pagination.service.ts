import { Injectable } from '@nestjs/common';
import { BasePaginatedQueryDto } from './dto/query/base-query-dto';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginatedResponseDto } from './dto/paginated-response.dto';

@Injectable()
export class PaginationService {
  public applySearchPaginationAndOrder<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    queryDto: BasePaginatedQueryDto,
    searchableColumns: Record<string, string>,
  ): void {
    this.applySearchFilter<T>(queryBuilder, searchableColumns, queryDto.search);

    this.applyPagination(queryBuilder, queryDto);
    this.applyOrderBy(queryBuilder, queryDto);
  }

  private applySearchFilter<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    columnEnum: Record<string, string>,
    searchTerm?: string,
  ): void {
    if (!searchTerm) return;

    const columns = Object.values(columnEnum);
    const searchConditions = columns
      .map((column) => {
        let subColumns = column.split('.');

        let query = '';
        if (subColumns.length === 1) {
          query = `"${queryBuilder.alias}"."${subColumns[0]}" ILIKE :search`;
        } else if (subColumns.length === 2) {
          query = `"${subColumns[0]}"."${subColumns[1]}" ILIKE :search`;
        } else {
          throw new Error('Invalid column format for search');
        }

        return query;
      })
      .join(' OR ');

    queryBuilder.andWhere(`(${searchConditions})`, {
      search: `%${searchTerm}%`,
    });
  }

  private applyPagination<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    queryDto: BasePaginatedQueryDto,
  ): void {
    const { page, size } = queryDto;
    queryBuilder.skip((page - 1) * size).take(size);
  }

  private applyOrderBy<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    queryDto: BasePaginatedQueryDto,
  ): void {
    const orderColumn = queryDto.order.column;

    queryBuilder.orderBy(
      `${queryBuilder.alias}.${orderColumn}`,
      queryDto.order.direction,
    );
  }

  public createPaginatedResponse<T>(
    items: T[],
    total: number,
    queryDto: BasePaginatedQueryDto,
  ): PaginatedResponseDto<T> {
    return new PaginatedResponseDto({
      items: items,
      size: queryDto.size,
      page: queryDto.page,
      totalItems: total,
    });
  }
}
