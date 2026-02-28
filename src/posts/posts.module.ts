import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from 'src/assets/assets.module';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AssetsModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService, TypeOrmModule],
})
export class PostsModule {}
