import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNumber,
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
  @IsOptional()
  @Length(1, 5000)
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
  media: Array<Express.Multer.File>; // appended by controller, not processed by Nest in the request body

  @IsOptional()
  // needed only for multipart/form-data
  @Transform(({ value }) => {
    // Case 1: "1,2,3"
    if (typeof value === 'string') {
      return value.split(',').map((v) => Number(v));
    }

    // Case 2: ["1","2"]
    if (Array.isArray(value)) {
      return value.map((v) => Number(v));
    }
    return value;
  })
  @IsNumber(undefined, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ApiProperty({
    type: 'array',
    items: {
      type: 'number',
    },
  })
  tags?: number[];
}
