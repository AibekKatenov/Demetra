import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Тестовое задание для Demetra Systems';
  }
}
