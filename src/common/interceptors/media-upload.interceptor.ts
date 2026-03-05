import * as multer from 'multer';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  MULTER_CONFIG_KEY,
  MediaUploadConfig,
} from '../decorators/validate-media-upload.decorator';
import { CommonErrorDefinitions } from '../error-definitions';

const FIELD_NAME = 'media';
const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = /^image\/(jpeg|png|webp)$/;

@Injectable()
export class MediaUploadInterceptor implements NestInterceptor {
  private readonly logger = new Logger('MediaUploadInterceptor');

  constructor(private reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    // retrieve metadata from the handler
    const config = this.reflector.get<MediaUploadConfig>(
      MULTER_CONFIG_KEY,
      context.getHandler(),
    );

    // set defaults if options aren't provided
    const fieldName = config?.fieldName ?? FIELD_NAME;
    const maxCount = config?.maxCount ?? MAX_FILES;
    const maxSize = config?.maxSize ?? MAX_FILE_SIZE;
    const allowedTypes = config?.allowedTypes ?? ALLOWED_TYPES;

    // create the multer instance
    const upload = multer({
      limits: { fileSize: maxSize, files: maxCount },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(allowedTypes)) {
          return callback(
            CommonErrorDefinitions.INVALID_MEDIA_TYPE.build(400, {
              fileName: file.originalname,
            }) as any,
            false,
          );
        }
        callback(null, true);
      },
    }).array(fieldName, maxCount);

    // execute and catch raw Multer errors
    return new Promise((resolve, reject) => {
      upload(req, res, (err: any) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            const errorMap: Record<string, any> = {
              LIMIT_FILE_SIZE: CommonErrorDefinitions.FILE_TOO_LARGE,
              LIMIT_FILE_COUNT: CommonErrorDefinitions.TOO_MANY_FILES,
              LIMIT_UNEXPECTED_FILE: CommonErrorDefinitions.UNEXPECTED_FILE,
            };
            const mapped =
              errorMap[err.code] || CommonErrorDefinitions.UNKNOWN_UPLOAD_ERROR;
            return reject(mapped.build());
          }

          if (err instanceof HttpException) return reject(err);

          this.logger.error('File upload error', err.stack);
          return reject(new InternalServerErrorException('File upload failed'));
        }
        resolve(next.handle());
      });
    });
  }
}
