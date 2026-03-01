import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { UploadPostDto } from './dto/upload-post.dto';
import { ValidateMediaUpload } from './decorators/validate-media-upload.decorator';
import { PostErrorDefinitions } from './error-definitions';
import { SecureImagesValidationPipe } from './pipes/secure-images-validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserPost } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Auth()
  @ValidateMediaUpload()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: UserPost,
  })
  create(
    @UploadedFiles(new SecureImagesValidationPipe())
    media: Array<Express.Multer.File>,
    @Body()
    dto: UploadPostDto,
    @GetUser()
    user: User,
  ) {
    if (media.length === 0) {
      throw PostErrorDefinitions.NOT_ENOUGH_MEDIA.build(400);
    }

    dto.media = media;
    return this.postsService.create(dto, user);
  }
}
