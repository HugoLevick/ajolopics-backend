import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config: DataSourceOptions = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: Number.parseInt(process.env.DB_PORT ?? '5432'),
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
  database: `${process.env.DB_NAME}`,
  extra: {
    decimalNumbers: true,
  },
  migrations: ['dist/migrations/*{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
