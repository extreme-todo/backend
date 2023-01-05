import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TotalFocusTime } from './entities/total-focus-time.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FocusService {
  constructor(
    @InjectRepository(TotalFocusTime) private repo: Repository<TotalFocusTime>,
  ) {}

  async init(user: User) {
    const focusTime = this.repo.create();
    focusTime.user = user;
    return this.repo.save(focusTime);
  }

  async findTime(user: User) {
    const focusTime = this.repo.findOne({ where: { user } });
    return focusTime;
  }

  async addTime(user: User, time: number) {
    const focusTime = await this.repo.findOne({ where: { user } });
    focusTime.today += time;
    return this.repo.save(focusTime);
  }

  async updateDay() {
    return this.repo.createQueryBuilder().update();
  }

  async updateWeek(user: User) {
    const focusTime = await this.repo.findOne({ where: { user } });
    focusTime.lastWeek = focusTime.thisWeek;
    focusTime.thisWeek = 0;
    return this.repo.save(focusTime);
  }

  async updateMonth(user: User) {
    const focusTime = await this.repo.findOne({ where: { user } });
    focusTime.lastMonth = focusTime.thisMonth;
    focusTime.thisMonth = 0;
    return this.repo.save(focusTime);
  }
}
