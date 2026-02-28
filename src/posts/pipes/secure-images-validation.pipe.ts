import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { PostErrorDefinitions } from '../error-definitions';

@Injectable()
export class SecureImagesValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File | Express.Multer.File[]) {
    if (!value) {
      throw PostErrorDefinitions.NOT_ENOUGH_MEDIA.build(400);
    }

    // Normalize to array for consistent processing
    const files = Array.isArray(value) ? value : [value];

    if (files.length === 0) {
      throw PostErrorDefinitions.NOT_ENOUGH_MEDIA.build(400);
    }

    // Validate each file
    for (const file of files) {
      if (!file.buffer) {
        throw PostErrorDefinitions.INVALID_OR_CORRUPTED_MEDIA.format(
          file.originalname,
        ).build(400, { fileName: file.originalname });
      }

      const detectedType = await fileTypeFromBuffer(
        new Uint8Array(file.buffer),
      );

      if (!detectedType || !detectedType.mime.startsWith('image/')) {
        throw PostErrorDefinitions.INVALID_MEDIA_TYPE.format(
          file.originalname,
        ).build(400, { fileName: file.originalname });
      }
    }

    return value; // return original type (single or array)
  }
}
