import { SetMetadata, applyDecorators, UseInterceptors } from '@nestjs/common';
import { MediaUploadInterceptor } from '../interceptors/media-upload.interceptor';

export const MULTER_CONFIG_KEY = 'multer_config_key';

/**
 * Options for configuring media upload validation.
 */
export interface UploadOptions {
  /** Maximum number of files allowed in the upload */
  maxCount?: number;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Regular expression pattern for allowed file types */
  allowedTypes?: RegExp;
}

/**
 * Configuration for media upload with field name.
 */
export interface MediaUploadConfig extends UploadOptions {
  /** Name of the form field for file upload */
  fieldName: string;
}

/**
 * Decorator for validating media uploads.
 * Applies metadata and interceptor configuration for handling file uploads.
 *
 * @param fieldName - The name of the form field to accept files from
 * @param options - Upload validation options (maxCount, maxSize, allowedTypes)
 * @returns Decorator function that applies media upload validation
 *
 * @example
 * ```typescript
 * @ValidateMediaUpload('avatar', { maxSize: 10 * 1024 * 1024, allowedTypes: /image\// })
 * ```
 */
export function ValidateMediaUpload(
  fieldName?: string,
  options: UploadOptions = {},
) {
  return applyDecorators(
    SetMetadata(MULTER_CONFIG_KEY, { ...options, fieldName }),
    UseInterceptors(MediaUploadInterceptor),
  );
}
