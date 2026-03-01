import { Injectable, Logger } from '@nestjs/common';
import { UploadPostDto } from './dto/upload-post.dto';
import { AssetsService } from 'src/assets/assets.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPost } from './entities/post.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TagsService } from 'src/tags/tags.service';
import { FeedQueryDto } from './dto/feed-query/feed-query.dto';
import { PaginationService } from 'src/common/pagination.service';
import { SearchableFeedFields } from './enums/searchable-feed-fields.enum';
import { AspectRatioEnum } from './dto/feed-query/feed-filters.dto';
import { MediaVariantType } from 'src/assets/entities/media-variant.entity';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { OrderDirection } from 'src/common/dto/query/base-query-dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger('PostsService');
  constructor(
    @InjectRepository(UserPost)
    private readonly postRepository: Repository<UserPost>,
    private readonly paginationService: PaginationService,
    private readonly assetsService: AssetsService,
    private readonly tagsService: TagsService,
  ) {}

  private async applyFiltersToQueryBuilder(
    queryBuilder: SelectQueryBuilder<UserPost>,
    queryDto: FeedQueryDto,
  ) {
    queryDto.order = {
      column: 'createdAt',
      direction: OrderDirection.DESC,
    };

    this.paginationService.applySearchPaginationAndOrder(
      queryBuilder,
      queryDto,
      SearchableFeedFields,
    );

    if (queryDto.filters?.tagIds) {
      await this.tagsService.validateTagIdsExist(queryDto.filters.tagIds);
      this.applyTagsFilter(queryBuilder, queryDto.filters.tagIds);
    }

    if (queryDto.filters?.aspectRatio)
      this.applyAspectRatioFilter(queryBuilder, queryDto.filters?.aspectRatio);

    if (queryDto.filters?.authorIds)
      this.applyAuthorsFilter(queryBuilder, queryDto.filters?.authorIds);
  }

  private applyTagsFilter(
    queryBuilder: SelectQueryBuilder<UserPost>,
    tags?: number[],
  ) {
    queryBuilder.andWhere('tags.id IN (:...tagIds)', { tagIds: tags });
  }

  private applyAspectRatioFilter(
    queryBuilder: SelectQueryBuilder<UserPost>,
    aspectRatio?: AspectRatioEnum,
  ) {
    switch (aspectRatio) {
      // NULLIF is used to prevent division by zero in case height is zero, which should not happen but is a safeguard
      case AspectRatioEnum.SQUARE:
        queryBuilder.andWhere(
          'variants.width::numeric / NULLIF(variants.height, 0) BETWEEN 0.95 AND 1.05',
        );
        break;
      case AspectRatioEnum.PORTRAIT:
        queryBuilder.andWhere(
          'variants.width::numeric / NULLIF(variants.height, 0) < 0.95',
        );
        break;
      case AspectRatioEnum.LANDSCAPE:
        queryBuilder.andWhere(
          'variants.width::numeric / NULLIF(variants.height, 0) > 1.05',
        );
        break;
    }
  }

  private applyAuthorsFilter(
    queryBuilder: SelectQueryBuilder<UserPost>,
    authorIds?: string[],
  ) {
    queryBuilder.andWhere('author.id IN (:...authorIds)', { authorIds });
  }

  private createBaseFeedQueryBuilder(): SelectQueryBuilder<UserPost> {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.assets', 'assets')
      .leftJoinAndSelect('assets.variants', 'variants')
      .leftJoinAndSelect('post.tags', 'tags')
      .andWhere('variants.variant = :variant', {
        variant: MediaVariantType.THUMBNAIL,
      });
  }

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

  public async getFeed(
    queryDto: FeedQueryDto,
  ): Promise<PaginatedResponseDto<UserPost>> {
    const queryBuilder = this.createBaseFeedQueryBuilder();

    await this.applyFiltersToQueryBuilder(queryBuilder, queryDto);

    const [feed, total] = await queryBuilder.getManyAndCount();

    return this.paginationService.createPaginatedResponse(
      feed,
      total,
      queryDto,
    );
  }

  async create(uploadPostDto: UploadPostDto, user: User) {
    const { media, tags, ...postData } = uploadPostDto;

    const queryRunner =
      this.postRepository.manager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create the Post entity
      const post = queryRunner.manager.create(UserPost, {
        ...postData,
        author: user,
      });

      if (tags && tags.length > 0) {
        post.tags = await this.tagsService.validateTagIdsExist(tags);
      }

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
