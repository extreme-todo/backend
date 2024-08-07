import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getTime(user: User) {
    const focusTime = this.repo.findOne({ where: { user: { id: user.id } } });
    return focusTime;
  }

  async addTime(user: User, time: number) {
    const focusTime = await this.repo.findOne({
      where: { user: { id: user.id } },
    });
    focusTime.total += time;
    focusTime.today += time;
    focusTime.thisWeek += time;
    focusTime.thisMonth += time;
    return this.repo.save(focusTime);
  }

  async updateDay() {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({ yesterday: () => 'today', today: 0 })
      .execute();
    console.log('updated daily focus time');
  }

  async updateWeek() {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({ lastWeek: () => 'thisWeek', thisWeek: 0 })
      .execute();
    console.log('updated weekly focus time');
  }

  async updateMonth() {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({ lastMonth: () => 'thisMonth', thisMonth: 0 })
      .execute();
    console.log('updated monthly focus time');
  }

  async resetFocus(user: User) {
    const { id: userId } = user;
    const { affected } = await this.repo
      .createQueryBuilder()
      .update()
      .set({
        total: 0,
        today: 0,
        yesterday: 0,
        thisWeek: 0,
        lastWeek: 0,
        thisMonth: 0,
        lastMonth: 0,
      })
      .where('user = :userId', { userId })
      .execute();
    if (affected === 0) {
      throw new NotFoundException('db update failed');
    }
  }
}
