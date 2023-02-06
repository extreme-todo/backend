import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { TimerService } from './timer.service';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateFocusDto } from './dto/update-focus.dto';
import { UpdateRestDto } from './dto/update-rest-dto';

@Controller('api/timer')
export class TimerController {
  constructor(private timerService: TimerService) {}

  @Get('total_focus')
  @UseGuards(AuthGuard)
  getTotalFocusTime(@CurrentUser() user: User) {
    return this.timerService.getTotalFocusTime(user);
  }

  @Get('total_rest')
  @UseGuards(AuthGuard)
  getTotalRestTime(@CurrentUser() user: User) {
    return this.timerService.getTotalRestTime(user);
  }

  @Get('progress')
  @UseGuards(AuthGuard)
  getProgress(@CurrentUser() user: User) {
    return this.timerService.getProgress(user);
  }

  @Patch('total_focus')
  @UseGuards(AuthGuard)
  updateTotalFocusTime(
    @Body() focusData: UpdateFocusDto,
    @CurrentUser() user: User,
  ) {
    return this.timerService.updateFocusTime(focusData.addFocusTime, user);
  }

  @Patch('total_rest')
  @UseGuards(AuthGuard)
  updateTotalRestTime(
    @Body() restData: UpdateRestDto,
    @CurrentUser() user: User,
  ) {
    return this.timerService.updateRestTime(restData.addRestTime, user);
  }
}
