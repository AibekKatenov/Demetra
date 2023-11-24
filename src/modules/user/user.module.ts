import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entities/user.entity';
import { BullModule } from '@nestjs/bull';
import { UpdateStatusProcessor } from './user.processor';
import { CacheManagerModule } from '../cache/cache.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.registerQueue({
      name: "update-status-queue"
    }),
    CacheManagerModule
  ],
  controllers: [UserController],
  providers: [UserService, UpdateStatusProcessor, EmailService],
})
export class UserModule {}
