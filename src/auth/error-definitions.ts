import { ErrorDefinition } from 'src/common/classes/error-definition';

export const AuthErrorDefinitions = {
  INVALID_ROLE: new ErrorDefinition(
    'INVALID_ROLE',
    'User does not have the required role to access this resource',
    403,
  ),
  INVALID_CREDENTIALS: new ErrorDefinition(
    'INVALID_CREDENTIALS',
    'The provided credentials are invalid',
  ),
  INVALID_NAME_FORMAT: new ErrorDefinition(
    'INVALID_NAME_FORMAT',
    'Name must be a string',
  ),
  INVALID_NAME_LENGTH: new ErrorDefinition(
    'INVALID_NAME_LENGTH',
    'Name must be between 3 and 255 characters long',
  ),
  INVALID_EMAIL_LENGTH: new ErrorDefinition(
    'INVALID_EMAIL_LENGTH',
    'Email must be at most 255 characters long',
  ),
  INVALID_EMAIL_FORMAT: new ErrorDefinition(
    'INVALID_EMAIL_FORMAT',
    'Email must be a valid email address',
  ),
  EMAIL_ALREADY_REGISTERED: new ErrorDefinition(
    'EMAIL_ALREADY_REGISTERED',
    'The email is already registered',
  ),
  USERNAME_ALREADY_TAKEN: new ErrorDefinition(
    'USERNAME_ALREADY_TAKEN',
    'The username is already taken',
  ),
  INVALID_USERNAME_LENGTH: new ErrorDefinition(
    'INVALID_USERNAME_LENGTH',
    'Username must be between 3 and 15 characters long',
  ),
  INVALID_USERNAME_FORMAT: new ErrorDefinition(
    'INVALID_USERNAME_FORMAT',
    'Username may only contain lowercase letters, numbers, underscores, and dots',
  ),
  INVALID_PASSWORD_LENGTH: new ErrorDefinition(
    'INVALID_PASSWORD_LENGTH',
    'Password must be at least 8 characters long',
  ),
  INVALID_PASSWORD_FORMAT: new ErrorDefinition(
    'INVALID_PASSWORD_FORMAT',
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  ),
};
