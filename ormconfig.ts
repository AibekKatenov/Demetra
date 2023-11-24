import { config } from 'src/config';
import { DataSource, DataSourceOptions } from 'typeorm'

console.log(`${config.database.type} database '${config.database.name}' works at ${config.database.host}:${config.database.port}`);

export const appDataSource = new DataSource({
    type: config.database.type,
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,
    autoLoadEntities: true,
    entities: ['src/database/entities/*.entity{.ts,.js}'],
    migrations: ['src/database/migrations/*.ts'],
} as DataSourceOptions)