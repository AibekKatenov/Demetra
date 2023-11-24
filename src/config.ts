import * as process from 'process'
import * as dotenv from 'dotenv'

dotenv.config()

export type DBType = | 'mysql' | 'postgres' | 'sqlite' | 'mariadb'

export const config = {
    app: {
        port: parseInt(process.env.APP_PORT || '3000', 10),
        prefix: process.env.APP_API_PREFIX
    },
    database: {
        type: (process.env.DB_TYPE || 'postgres') as DBType,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        name: process.env.DB_NAME || 'db',
    },
    swagger: {
        path: process.env.SWAGGER_PATH
    },
    redis: {
        port: process.env.REDIS_PORT
    }
}  