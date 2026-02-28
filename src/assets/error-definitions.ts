import { ErrorDefinition } from 'src/common/classes/error-definition';

export const AssetsErrorDefinitions = {
  ERROR_PROCESSING_ASSET: new ErrorDefinition(
    'ERROR_PROCESSING_ASSET',
    'An error occurred while processing the asset "{}"',
    500,
  ),
};
