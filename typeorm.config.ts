import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();
const port: number = parseInt(<string>process.env.MYSQL_PORT) || 3306;

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  logging: false,
  entities: [__dirname + '/src/entities/*.entity.{js,ts}'],
  migrations: [__dirname + '/src/migrations/*.{js,ts}'],
  synchronize: false,
  timezone: '+00:00',
  replication: {
    master: {
      host: process.env.MYSQL_HOST,
      port: port,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    slaves: [
      {
        host: process.env.MYSQL_HOST,
        port: port,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      },
      {
        host: process.env.MYSQL_HOST,
        port: port,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      },
    ],
  },
};
export const dataSource = new DataSource(dataSourceOptions);
