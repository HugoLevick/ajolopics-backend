import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { MediaVariant } from './entities/media-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, MediaVariant])],
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService, TypeOrmModule],
})
export class AssetsModule {}
