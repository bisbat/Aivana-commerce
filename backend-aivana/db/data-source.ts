import { DataSource, DataSourceOptions } from "typeorm";
import {config} from 'dotenv';
config();

export const dataSourceOptions:DataSourceOptions={
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    logging: false,
    synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;