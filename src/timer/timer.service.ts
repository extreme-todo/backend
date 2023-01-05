import { Injectable, NotFoundException } from '@nestjs/common';
import { FocusService } from './focus.service';
import { RestService } from './rest.service';
import { User } from 'src/user/entities/user.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TimerService {
  constructor(
    private focusService: FocusService,
    private restService: RestService,
  ) {}

  async initTimer(user: User) {
    await this.focusService.init(user);
    await this.restService.init(user);
  }

  async getTotalFocusTime(user: User) {
    const focusTime = await this.focusService.getTime(user);
    if (!focusTime)
      throw new NotFoundException(
        '집중시간이 존재하지 않습니다. 초기화가 필요합니다.',
      );
    return focusTime;
  }

  async getTotalRestTime(user: User) {
    const restTime = await this.restService.getTime(user);
    if (!restTime)
      throw new NotFoundException(
        '집중시간이 존재하지 않습니다. 초기화가 필요합니다.',
      );
    return restTime;
  }

  async updateFocusTime(focused: number, user: User) {
    return await this.focusService.addTime(user, focused);
  }

  async updateRestTime(rest: number, user: User) {
    return await this.restService.addTime(user, rest);
  }

  // execute every 5am
  @Cron('0 10 * * * *')
  async updateDay() {
    await this.focusService.updateDay();
    await this.restService.updateDay();
  }

  // execute every monday 5am
  @Cron('0 0 5 * * 1')
  async updateWeek() {
    await this.focusService.updateWeek();
    await this.restService.updateWeek();
  }

  // execute every 1st day of the month 5am
  @Cron('0 0 5 1 * *')
  async updateMonth() {
    await this.focusService.updateMonth();
    await this.restService.updateMonth();
  }
}
