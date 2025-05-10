import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TimerService } from './timer.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { TimeUnit } from './dto/get-focused-time.dto';
@Controller('api/timer')
@UseGuards(AuthGuard)
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get('focused-time')
  async getFocusedTime(
    @CurrentUser() user: User,
    @Query('unit') unit: TimeUnit,
    @Query('timezoneOffset') timezoneOffset: number,
    @Query('categoryId') categoryId?: number,
  ) {
    return await this.timerService.getFocusedTimeByUnit(
      user,
      unit,
      timezoneOffset,
      categoryId,
    );
  }
}
