import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { UserEntity } from '@/database/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUserDto';

describe('EmailService', () => {
  let service: EmailService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an exception if email already exists', async () => {

    const createDto: CreateUserDto = {
      email: 'existing@example.com',
      name: 'someName',
      password: '12345',
    };

    (userRepository.findOne as jest.Mock).mockResolvedValue({});

    await expect(service.isEmailUnique(createDto)).rejects.toThrow(
      new HttpException('ERR_USER_EMAIL_EXISTS', HttpStatus.BAD_REQUEST),
    );
  });

  it('should not throw an exception if email is unique', async () => {
    const createDto: CreateUserDto = {
      email: 'unique@example.com',
      name: 'someName',
      password: '12345',
    };

    (userRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.isEmailUnique(createDto)).resolves.not.toThrow();
  });
});
