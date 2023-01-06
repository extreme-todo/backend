import { Controller, Get } from '@nestjs/common';
import { TimerService } from './timer.service';
import { User } from 'src/user/entities/user.entity';

@Controller('timer')
export class TimerController {
  constructor(private timerService: TimerService) {}

  // TODO: AuthGuard 등으로 가져온 유저를 사용할 예정
  @Get('total_focus')
  getTotalFocusTime() {
    const fakeUser = { email: 'asd@asd.asd', username: 'asd' } as User;
    return this.timerService.getTotalFocusTime(fakeUser);
  }

  // TODO: AuthGuard 등으로 가져온 유저를 사용할 예정
  @Get('total_rest')
  getTotalRestTime() {
    const fakeUser = { email: 'asd@asd.asd', username: 'asd' } as User;
    return this.timerService.getTotalRestTime(fakeUser);
  }

  @Get('progress')
  getProgress() {
    // TODO: 추이 로직 작성
  }
}
