import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TagDto {
  @Expose()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the tag',
  })
  id: number;

  @Expose()
  @ApiProperty({
    example: 'Nature',
    description: 'The name of the tag',
  })
  name: string;
}
