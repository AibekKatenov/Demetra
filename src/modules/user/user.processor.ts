import { UserEntity } from '@/database/entities/user.entity';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Repository } from 'typeorm';

@Processor('update-status-queue')
export class UpdateStatusProcessor {
  private readonly logger = new Logger(UpdateStatusProcessor.name)
  constructor(@InjectRepository(UserEntity) protected repo: Repository<UserEntity>,) {}

  @Process('statusChanger')
  async handleStatus(job: Job) {
    this.logger.debug("Start changing status");
    const user = await this.repo.findOne({where: {id: job.data.id}})
    user.status = true
    await this.repo.save(user)
    this.logger.debug("Changing status completed");
  }
}
