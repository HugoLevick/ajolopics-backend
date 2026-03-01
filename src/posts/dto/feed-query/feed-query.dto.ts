import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { BasePaginatedQueryDto } from 'src/common/dto/query/base-query-dto';
import { FeedFiltersDto } from './feed-filters.dto';

export class FeedQueryDto extends BasePaginatedQueryDto {
  @ApiPropertyOptional({
    type: FeedFiltersDto,
    description: 'Extra filters to narrow search down',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeedFiltersDto)
  public filters?: FeedFiltersDto;
}
