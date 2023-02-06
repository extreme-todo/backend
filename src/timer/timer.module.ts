import { Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotalFocusTime } from './entities/total-focus-time.entity';
import { TotalRestTime } from './entities/total-rest-time.entity';
import { FocusService } from './focus.service';
import { RestService } from './rest.service';

@Module({
  imports: [TypeOrmModule.forFeature([TotalFocusTime, TotalRestTime])],
  providers: [TimerService, FocusService, RestService],
  controllers: [TimerController],
  exports: [TimerService],
})
export class TimerModule {}
