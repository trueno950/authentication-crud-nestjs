import { DataSourceOptions } from 'typeorm';
require('dotenv').config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  url: process.env.DB_URL || '',
  database: process.env.DB_DATABASE || 'hostech_main_db',
  ssl: process.env.DB_SSL === 'true',
  extra: {
    ssl:
      process.env.DB_SSL === 'true'
        ? {
            rejectUnauthorized: false,
          }
        : null,
  },
  synchronize: true,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
};
export default config;
