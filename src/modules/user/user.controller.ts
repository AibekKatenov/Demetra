import { Body, ClassSerializerInterceptor, Controller, Get, Inject, ParseIntPipe, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';
import { UserEntity } from '@/database/entities/user.entity';

@Controller('user')
export class UserController {

  @Inject() private readonly dataService: UserService;

  constructor() {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.dataService.createUser(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('get-user-by-id')
  async findOne(@Query('id', ParseIntPipe) id: number){
    return this.dataService.findUser(id)
  }

  @Get('check-proxy-request')
  async proxyCheck(){
    const res = await this.dataService.axiosRequest()
    return res.data
  }
}
