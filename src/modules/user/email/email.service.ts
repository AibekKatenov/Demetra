import { UserEntity } from '@/database/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/createUserDto';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(UserEntity) protected repo: Repository<UserEntity>,
  ) {}

  async isEmailUnique(createDto: CreateUserDto) {
    const user = await this.repo.findOne({ where: { email: createDto.email } });
    if (user) {
      throw new HttpException('ERR_USER_EMAIL_EXISTS', HttpStatus.BAD_REQUEST);
    }
  }
}
