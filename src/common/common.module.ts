import { Global, Module } from '@nestjs/common';
import { PaginationService } from './pagination.service';
import { MediaUploadInterceptor } from './interceptors/media-upload.interceptor';

@Global()
@Module({
  providers: [PaginationService, MediaUploadInterceptor],
  exports: [PaginationService],
})
export class CommonModule {}
