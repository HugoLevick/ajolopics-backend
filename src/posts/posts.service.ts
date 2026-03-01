import { Injectable, Logger } from '@nestjs/common';
import { UploadPostDto } from './dto/upload-post.dto';
import { AssetsService } from 'src/assets/assets.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger('PostsService');
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly assetsService: AssetsService,
  ) {}

  async findOne(id: string) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['assets', 'assets.variants', 'tags', 'author'],
      order: {
        assets: {
          position: 'ASC',
        },
      },
    });
  }

  async create(uploadPostDto: UploadPostDto, user: User) {
    const { media, ...postData } = uploadPostDto;

    const queryRunner =
      this.postRepository.manager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create the Post entity
      const post = queryRunner.manager.create(Post, {
        ...postData,
        author: user,
      });
      const savedPost = await queryRunner.manager.save(post);

      // Create assets for the post
      if (media && media.length > 0) {
        await this.assetsService.createAssetsFromFiles(
          media,
          savedPost.id,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedPost.id);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
