import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ResFindAllTagsDto } from './dto/res-find-all-tags.dto';
import { ApiBearerAuth, ApiResponse, ApiSchema } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesEnum } from 'src/auth/enums/roles.enum';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all tags with their post count',
    type: [ResFindAllTagsDto],
  })
  findAll(): Promise<ResFindAllTagsDto[]> {
    return this.tagsService.findAll();
  }

  @Auth(RolesEnum.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
    type: Tag,
  })
  create(
    @Body() createTagDto: CreateTagDto,
    @GetUser() admin: User,
  ): Promise<Tag> {
    return this.tagsService.create(createTagDto, admin);
  }
}
