import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'Nature',
    description: 'The name of the tag',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  @Transform(({ value }) => value.trim())
  name: string;
}
