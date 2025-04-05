import { Controller, Get, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { TimerService } from './timer.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RecordFocusedTimeDto } from './dto/record-focused-time.dto';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { TimeUnit } from './dto/get-focused-time.dto';
@Controller('api/timer')
@UseGuards(AuthGuard)
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get('progress')
  async getProgress(
    @CurrentUser() user: User,
    @Query('currentTime') currentTime: string,
    @Query('offset') offset: number,
  ) {
    return await this.timerService.getProgress(user, currentTime, offset);
  }

  @Post('focused-time')
  async recordFocusedTime(
    @CurrentUser() user: User,
    @Body() dto: RecordFocusedTimeDto,
  ) {
    return await this.timerService.recordFocusedTime(user, dto);
  }

  @Get('focused-time')
  async getFocusedTime(
    @CurrentUser() user: User,
    @Query('categoryId') categoryId: number,
    @Query('unit') unit: TimeUnit,
    @Query('timezoneOffset') timezoneOffset: number,
  ) {
    return await this.timerService.getFocusedTimeByUnit(
      user,
      categoryId,
      unit,
      timezoneOffset,
    );
  }
}
