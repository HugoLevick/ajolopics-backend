import { SetMetadata, applyDecorators, UseInterceptors } from '@nestjs/common';
import { MediaUploadInterceptor } from '../interceptors/media-upload.interceptor';

export const MULTER_CONFIG_KEY = 'multer_config_key';

export interface UploadOptions {
  maxCount?: number;
  maxSize?: number;
  allowedTypes?: RegExp;
}

export interface MediaUploadConfig extends UploadOptions {
  fieldName: string;
}

export function ValidateMediaUpload(
  fieldName?: string,
  options: UploadOptions = {},
) {
  return applyDecorators(
    SetMetadata(MULTER_CONFIG_KEY, { ...options, fieldName }),
    UseInterceptors(MediaUploadInterceptor),
  );
}
