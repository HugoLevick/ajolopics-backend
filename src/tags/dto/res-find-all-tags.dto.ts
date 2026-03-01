import { ApiProperty } from '@nestjs/swagger';

export class ResFindAllTagsDto {
  @ApiProperty({ example: 1, description: 'The unique identifier of the tag' })
  id: number;

  @ApiProperty({ example: 'Nature', description: 'The name of the tag' })
  name: string;

  @ApiProperty({
    example: 5,
    description: 'The number of posts associated with this tag',
  })
  postCount: number;
}
