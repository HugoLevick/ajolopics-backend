import { ErrorDefinition } from './classes/error-definition';

export const CommonErrorDefinitions = {
  INVALID_MEDIA_TYPE: new ErrorDefinition(
    'INVALID_MEDIA_TYPE',
    'The uploaded file is not a valid type. Please upload only valid files.',
    400,
  ),
  FILE_TOO_LARGE: new ErrorDefinition(
    'FILE_TOO_LARGE',
    'One or more uploaded files exceed the maximum allowed.',
    400,
  ),
  TOO_MANY_FILES: new ErrorDefinition(
    'TOO_MANY_FILES',
    'You have exceeded the maximum number of files allowed.',
    400,
  ),
  UNEXPECTED_FILE: new ErrorDefinition(
    'UNEXPECTED_FILE',
    'An unexpected file was uploaded. Please check the field name and try again.',
    400,
  ),
  PART_COUNT_EXCEEDED: new ErrorDefinition(
    'PART_COUNT_EXCEEDED',
    'Too many parts were uploaded. Please check your request and try again.',
    400,
  ),
  UNKNOWN_UPLOAD_ERROR: new ErrorDefinition(
    'UNKNOWN_UPLOAD_ERROR',
    'An unknown error occurred during file upload. Please try again later.',
    500,
  ),
};
