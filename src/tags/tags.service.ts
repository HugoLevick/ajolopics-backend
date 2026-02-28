import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { ResFindAllTagsDto } from './dto/res-find-all-tags.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { User } from 'src/users/entities/user.entity';
import { TagErrorDefinitions } from './error-definitions';

@Injectable()
export class TagsService {
  private readonly logger = new Logger('TagsService');
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  public async findAll(): Promise<ResFindAllTagsDto[]> {
    const queryRunner = this.tagRepository.createQueryBuilder('tag');
    return queryRunner
      .select('tag.id', 'id')
      .addSelect('tag.name', 'name')
      .addSelect('CAST(COUNT(pt.postId) AS INTEGER)', 'postCount')
      .leftJoin('post_tags', 'pt', 'pt.tagId = tag.id')
      .groupBy('tag.id')
      .execute();
  }

  public async create(createTagDto: CreateTagDto, admin: User): Promise<Tag> {
    const existing = await this.tagRepository.findOne({
      where: { name: createTagDto.name },
    });

    if (existing) {
      throw TagErrorDefinitions.TAG_ALREADY_EXISTS.build();
    }

    this.logger.log(
      `Admin ${admin.name} is creating a new tag with name: ${createTagDto.name}`,
    );
    const newTag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(newTag);
  }
}
