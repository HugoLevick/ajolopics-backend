import { ErrorDefinition } from 'src/common/classes/error-definition';

export const PostErrorDefinitions = {
  POST_NOT_FOUND: new ErrorDefinition(
    'POST_NOT_FOUND',
    'Post with id "{}" not found',
    404,
  ),
  INVALID_OR_CORRUPTED_MEDIA: new ErrorDefinition(
    'INVALID_OR_CORRUPTED_MEDIA',
    'The media file "{}" is invalid or corrupted',
  ),
  INVALID_MEDIA_TYPE: new ErrorDefinition(
    'INVALID_MEDIA_TYPE',
    'The media type of "{}" is not supported',
  ),
  INVALID_FILE_SIZE: new ErrorDefinition(
    'INVALID_FILE_SIZE',
    'The file size of "{}" is invalid',
  ),
  NOT_ENOUGH_MEDIA: new ErrorDefinition(
    'NOT_ENOUGH_MEDIA',
    'Not enough media files provided',
  ),
  TOO_MUCH_MEDIA: new ErrorDefinition(
    'TOO_MUCH_MEDIA',
    'Too many media files provided',
  ),
  UNAUTHORIZED_TO_DELETE_POST: new ErrorDefinition(
    'UNAUTHORIZED_TO_DELETE_POST',
    'You are not authorized to delete this post',
  ),
};
