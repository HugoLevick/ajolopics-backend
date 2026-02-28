import * as fs from 'fs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import {
  MediaVariant,
  MediaVariantType,
} from './entities/media-variant.entity';
import * as sharp from 'sharp';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { AssetsErrorDefinitions } from './error-definitions';
import { getHostUrl } from 'src/common/functions/get-host-url';

interface VariantRuleI {
  width?: number;
  quality?: number;
  format?: string;
}

export const variantRules: Record<MediaVariantType, VariantRuleI> = {
  [MediaVariantType.ORIGINAL]: {
    width: undefined,
    quality: 90,
    format: 'original',
  },
  [MediaVariantType.MEDIUM]: { width: 1200, quality: 80, format: 'webp' },
  [MediaVariantType.THUMBNAIL]: { width: 400, quality: 70, format: 'webp' },
};

@Injectable()
export class AssetsService {
  private readonly logger = new Logger('AssetsService');

  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    @InjectRepository(MediaVariant)
    private readonly mediaVariantRepository: Repository<MediaVariant>,
    private readonly configService: ConfigService,
  ) {}

  public async createAssetsFromFiles(
    file: Express.Multer.File | Express.Multer.File[],
    postId: string,
    externalQueryRunner?: QueryRunner,
  ) {
    const files = Array.isArray(file) ? file : [file];

    const queryRunner =
      externalQueryRunner ??
      this.assetRepository.manager.connection.createQueryRunner();

    const shouldManageTransaction = !externalQueryRunner;

    if (shouldManageTransaction) {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }

    const writtenFiles: string[] = [];

    try {
      const createdAssets: Asset[] = [];

      for (const [index, file] of files.entries()) {
        const asset = queryRunner.manager.create(Asset, {
          filename: file.originalname,
          position: index,
          post: { id: postId },
        });

        await queryRunner.manager.save(asset);

        const variants: MediaVariant[] = [];

        for (const variantType of Object.values(MediaVariantType)) {
          const variant = await this.processAssetVariant(
            asset,
            file,
            variantType,
            writtenFiles, // track disk writes
          );

          variants.push(variant);
        }

        asset.variants = variants;
        createdAssets.push(asset);
      }

      await queryRunner.manager.save(createdAssets);

      if (shouldManageTransaction) {
        await queryRunner.commitTransaction();
      }

      return createdAssets;
    } catch (error) {
      if (shouldManageTransaction) {
        await queryRunner.rollbackTransaction();
      }

      // Cleanup written files
      await this.cleanupWrittenFiles(writtenFiles);

      throw error;
    } finally {
      if (shouldManageTransaction) {
        await queryRunner.release();
      }
    }
  }

  public async processAssetVariant(
    asset: Asset,
    file: Express.Multer.File,
    variantType: MediaVariantType,
    writtenFiles: string[],
  ): Promise<MediaVariant> {
    let transformer = sharp(file.buffer).rotate();

    const variantRule = variantRules[variantType];
    if (!variantRule) {
      throw new InternalServerErrorException(
        `Unsupported variant type: ${variantType}`,
      );
    }

    if (variantType !== MediaVariantType.ORIGINAL) {
      transformer = transformer.withMetadata({ exif: undefined });
    }

    if (variantRule.width) {
      transformer = transformer.resize({
        width: variantRule.width,
        withoutEnlargement: true,
      });
    }

    let buffer: Buffer;
    let extension: string;
    let mimeType: string;

    if (variantRule.format === 'original') {
      buffer = file.buffer;
      extension = file.originalname.split('.').pop() || 'jpg';
      mimeType = file.mimetype;
    } else if (variantRule.format === 'webp') {
      buffer = await transformer
        .webp({ quality: variantRule.quality ?? 80 })
        .toBuffer();

      extension = 'webp';
      mimeType = 'image/webp';
    } else {
      throw new InternalServerErrorException(
        `Unsupported format: ${variantRule.format}`,
      );
    }

    const metadata = await sharp(buffer).metadata();
    const filename = `${asset.id}-${variantType}.${extension}`;
    const uploadDir = this.configService.getOrThrow('UPLOAD_DIR');
    const relativePath = `${uploadDir}/${filename}`;
    const absolutePath = relativePath;

    // Write to disk
    await sharp(buffer).toFile(absolutePath);

    // Track successful write
    writtenFiles.push(absolutePath);

    const hostUrl = getHostUrl(this.configService);

    return this.mediaVariantRepository.create({
      url: `${hostUrl}/${relativePath}`,
      key: relativePath,
      variant: variantType,
      width: metadata.width,
      height: metadata.height,
      size: buffer.length,
      mimeType,
      asset,
    });
  }

  private async cleanupWrittenFiles(paths: string[]) {
    for (const path of paths) {
      try {
        await fs.promises.unlink(path);
        this.logger.warn(`Cleaned up file after failure: ${path}`);
      } catch (err) {
        this.logger.error(`Failed to cleanup file: ${path} — ${err.message}`);
      }
    }
  }
}
