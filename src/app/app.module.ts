import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DBType, config } from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@/modules/user/user.module';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheManagerModule } from '@/modules/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [() => config]
    }),
    TypeOrmModule.forRoot({
      type: config.database.type as DBType,
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
      entities: [__dirname + '/../database/entities/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'] 
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: parseInt(config.redis.port),
      },
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: parseInt(config.redis.port),
      },
      isGlobal: true
    }),
    UserModule,
    CacheManagerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
