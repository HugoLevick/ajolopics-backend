import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { UserPostDto } from './user-post.dto';
import { Expose, Type } from 'class-transformer';

export class PaginatedUserPostDto extends PaginatedResponseDto<UserPostDto> {
  @Expose()
  @Type(() => UserPostDto)
  items: UserPostDto[];
}
