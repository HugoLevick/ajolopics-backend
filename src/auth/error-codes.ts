import { ErrorDefinition } from 'src/common/classes/error-definition';

export const AuthErrorCodes = {
  INVALID_CREDENTIALS: new ErrorDefinition(
    'INVALID_CREDENTIALS',
    'The provided credentials are invalid',
  ),
  EMAIL_ALREADY_REGISTERED: new ErrorDefinition(
    'EMAIL_ALREADY_REGISTERED',
    'The email is already registered',
  ),
};
