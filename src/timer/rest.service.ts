import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TotalRestTime } from './entities/total-rest-time.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RestService {
  constructor(
    @InjectRepository(TotalRestTime) private repo: Repository<TotalRestTime>,
  ) {}

  async init(user: User) {
    const restTime = this.repo.create();
    restTime.user = user;
    return this.repo.save(restTime);
  }

  async findTime(user: User) {
    const restTime = this.repo.findOne({ where: { user } });
    return restTime;
  }

  async addTime(user: User, time: number) {
    const restTime = await this.repo.findOne({ where: { user } });
    restTime.today += time;
    return this.repo.save(restTime);
  }

  async updateDay() {
    return this.repo.createQueryBuilder().update();
  }

  async updateWeek(user: User) {
    const restTime = await this.repo.findOne({ where: { user } });
    restTime.lastWeek = restTime.thisWeek;
    restTime.thisWeek = 0;
    return this.repo.save(restTime);
  }

  async updateMonth(user: User) {
    const restTime = await this.repo.findOne({ where: { user } });
    restTime.lastMonth = restTime.thisMonth;
    restTime.thisMonth = 0;
    return this.repo.save(restTime);
  }
}
