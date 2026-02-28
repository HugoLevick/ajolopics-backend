import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadPostDto } from './dto/upload-post.dto';
import { ValidateMediaUpload } from './decorators/validate-media-upload.decorator';
import { PostErrorDefinitions } from './error-definitions';
import { SecureImagesValidationPipe } from './pipes/secure-images-validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesEnum } from 'src/auth/enums/roles.enum';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Auth(RolesEnum.USER)
  @ValidateMediaUpload()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFiles(new SecureImagesValidationPipe())
    media: Array<Express.Multer.File>,
    @Body()
    dto: UploadPostDto,
  ) {
    if (media.length === 0) {
      throw PostErrorDefinitions.NOT_ENOUGH_MEDIA.build(400);
    }

    dto.media = media;
    return this.postsService.create(dto);
  }
}
