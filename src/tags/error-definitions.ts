import { ErrorDefinition } from 'src/common/classes/error-definition';

export const TagErrorDefinitions = {
  TAG_ALREADY_EXISTS: new ErrorDefinition(
    'TAG_ALREADY_EXISTS',
    'Tag name is already in use',
    409,
  ),
  TAG_NOT_FOUND: new ErrorDefinition(
    'TAG_NOT_FOUND',
    'Tag with the ID "{}" does not exist',
    404,
  ),
};
