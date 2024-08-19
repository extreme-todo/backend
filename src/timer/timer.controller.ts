import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TimerService } from './timer.service';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('api/timer')
@UseGuards(AuthGuard)
export class TimerController {
  constructor(private timerService: TimerService) {}

  @Get('progress')
  getProgress(
    @CurrentUser() user: User,
    @Query('currentDate') currentDate: string,
    @Query('offset') offset: string,
  ) {
    return this.timerService.getProgress(user, currentDate, parseInt(offset));
  }
}
