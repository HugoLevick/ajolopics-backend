import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UploadPostDto {
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    required: true,
    description: 'Title of the post',
    minLength: 0,
    maxLength: 255,
  })
  title: string;

  @IsString()
  @Length(1, 5000)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Optional description for the post',
    minLength: 0,
    maxLength: 5000,
  })
  description: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  media: Array<Express.Multer.File>; // appended by controller, not sent by client in the request body
}
