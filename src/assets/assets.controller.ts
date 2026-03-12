import {
  Controller,
  Get,
  Header,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  StreamableFile,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { OptionalAuth } from 'src/auth/decorators/optional-auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { MediaVariantType } from './entities/media-variant.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @OptionalAuth()
  @Get(':assetId/:variant')
  @Header('Cache-Control', 'public, max-age=31536000, immutable')
  @ApiBearerAuth()
  async getAssetFile(
    @Param('assetId', ParseUUIDPipe)
    assetId: string,
    @Param('variant', new ParseEnumPipe(MediaVariantType))
    variant: MediaVariantType,
    @GetUser({ optional: true })
    user: User | null,
  ) {
    const { buffer, mediaVariant } = await this.assetsService.getAssetFile(
      assetId,
      variant,
      user,
    );
    return new StreamableFile(buffer, {
      type: mediaVariant.mimeType,
      disposition: `inline; filename="${mediaVariant.key}"`,
    });
  }
}
