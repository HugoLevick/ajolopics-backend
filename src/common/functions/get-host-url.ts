import { ConfigService } from '@nestjs/config';

export function getHostUrl(configService: ConfigService): string {
  const host = configService.getOrThrow('HOST');
  const port = configService.get('PORT'); // PORT is optional, so we don't throw if it's missing
  if (!port) {
    return host;
  } else {
    return `${host}:${port}`;
  }
}
