import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { UploadPostDto } from './dto/upload-post.dto';
import { ValidateMediaUpload } from '../common/decorators/validate-media-upload.decorator';
import { PostErrorDefinitions } from './error-definitions';
import { SecureImagesValidationPipe } from './pipes/secure-images-validation.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UserPost } from './entities/post.entity';
import { FeedQueryDto } from './dto/feed-query/feed-query.dto';
import { plainToInstance } from 'class-transformer';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginatedUserPostDto } from './dto/paginated-user-post.dto';
import { UserPostDto } from './dto/user-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('feed')
  @HttpCode(HttpStatus.OK)
  async getFeed(@Body() queryDto: FeedQueryDto) {
    const posts = await this.postsService.getFeed(queryDto);

    return plainToInstance(PaginatedUserPostDto, posts, {
      excludeExtraneousValues: true,
    });
  }

  @Get('single/:id')
  @HttpCode(HttpStatus.OK)
  async getSinglePost(@Param('id', ParseUUIDPipe) id: string) {
    const post = await this.postsService.findOne(id);

    return plainToInstance(UserPostDto, post, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @Auth()
  @ValidateMediaUpload('media', { maxCount: 3, maxSize: 30 * 1024 * 1024 })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: UserPostDto,
  })
  async create(
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
    const post = await this.postsService.create(dto, user);

    return plainToInstance(UserPostDto, post, {
      excludeExtraneousValues: true,
    });
  }

  @Auth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.postsService.delete(id, user);
  }
}
