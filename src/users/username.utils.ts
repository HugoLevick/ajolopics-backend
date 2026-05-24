export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;
export const USERNAME_REGEX = /^[a-z0-9_.]+$/;

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}
