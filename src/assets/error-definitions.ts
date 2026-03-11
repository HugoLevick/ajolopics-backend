import { HttpStatus } from '@nestjs/common';
import { ErrorDefinition } from 'src/common/classes/error-definition';

export const AssetsErrorDefinitions = {
  ERROR_PROCESSING_ASSET: new ErrorDefinition(
    'ERROR_PROCESSING_ASSET',
    'An error occurred while processing the asset "{}"',
    HttpStatus.INTERNAL_SERVER_ERROR,
  ),
  ASSET_NOT_FOUND: new ErrorDefinition(
    'ASSET_NOT_FOUND',
    'The requested asset was not found',
    HttpStatus.NOT_FOUND,
  ),
  UNAUTHORIZED_ACCESS: new ErrorDefinition(
    'FORBIDDEN',
    'You do not have permission to access this asset',
    HttpStatus.FORBIDDEN,
  ),
};
