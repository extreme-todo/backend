import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getTime(user: User) {
    const restTime = this.repo.findOne({ where: { user: { id: user.id } } });
    return restTime;
  }

  async addTime(user: User, time: number) {
    const restTime = await this.repo.findOne({
      where: { user: { id: user.id } },
    });
    restTime.total += time;
    restTime.today += time;
    restTime.thisWeek += time;
    restTime.thisMonth += time;
    return this.repo.save(restTime);
  }

  async updateDay() {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({ yesterday: () => 'today', today: 0 })
      .execute();
    console.log('updated daily rest time');
  }

  async updateWeek() {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({ lastWeek: () => 'thisWeek', thisWeek: 0 })
      .execute();
    console.log('updated weekly rest time');
  }

  async updateMonth() {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({ lastMonth: () => 'thisMonth', thisMonth: 0 })
      .execute();
    console.log('updated monthly rest time');
  }

  async resetRest(user: User) {
    const { id: userId } = user;
    const { affected } = await this.repo
      .createQueryBuilder()
      .update()
      .set({ today: 0, yesterday: 0, thisWeek: 0, lastWeek: 0, thisMonth: 0 })
      .where('user = :userId', { userId })
      .execute();

    if (affected === 0) {
      throw new NotFoundException('db update failed');
    }
  }
}
