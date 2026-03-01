import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostErrorDefinitions } from '../error-definitions';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export function ValidateMediaUpload(fieldName = 'media') {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(fieldName, MAX_FILES, {
        limits: {
          fileSize: MAX_FILE_SIZE,
        },
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.startsWith('image/')) {
            return callback(
              PostErrorDefinitions.INVALID_MEDIA_TYPE.format(
                file.originalname,
              ).build(400, {
                fileName: file.originalname,
              }),
              false,
            );
          }
          callback(null, true);
        },
      }),
    ),
  );
}
