import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/database/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CacheService } from '@/modules/cache/cache.service';
import axios from 'axios';
import { EmailService } from './email/email.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger('redisIsReady');

  constructor(
    @InjectRepository(UserEntity) protected repo: Repository<UserEntity>,
    @InjectQueue('update-status-queue') private statusQueue: Queue,
    @Inject(CacheService) private readonly cacheService: CacheService,
    @Inject(EmailService) private readonly emailService: EmailService,
  ) {}

  async createUser(createDto: CreateUserDto) {
    await this.emailService.isEmailUnique(createDto);
    const res = await this.repo.insert(createDto);
    if (this.statusQueue.client.status === 'ready') {
      this.logger.debug('Redis is connected');
    } else {
      this.logger.debug('Connection with Redis did not work');
    }
    this.statusQueue.add(
      'statusChanger',
      {
        id: res.raw[0].id,
      },
      {
        delay: 10000,
      },
    );
    return res;
  }

  async findUser(id: number) {
    const userCache = await this.cacheService.getCacheData(id);
    if (userCache) {
      delete userCache.user.password; // Странная уязвимость, пробовал CacheInterceptor, но все равно возвращает пароль в ответе, решил оставить такой вариант
      return {
        statusCode: HttpStatus.OK,
        message: 'SUCCESS(from cache)',
        user: userCache.user,
      };
    }
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('ERR_USER_NOT_FOUND', HttpStatus.BAD_REQUEST);
    }
    await this.cacheService.setCacheData(user);
    console.log('cached user');
    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      user: user,
    };
  }

  async axiosRequest() {
    try {
      return axios.get('https://rickandmortyapi.com/api/character/200', {
        proxy: {
          protocol: 'http',
          host: '45.196.48.9',
          port: 5435,
          auth: {
            username: 'jtzhwqur',
            password: 'jnf0t0n2tecg',
          },
        },
      });
    } catch {
      throw new BadRequestException({ message: 'Proxy request failed' });
    }
  }
}
