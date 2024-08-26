import { Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { TodoModule } from 'src/todo/todo.module';
@Module({
  imports: [TodoModule],
  providers: [TimerService],
  controllers: [TimerController],
})
export class TimerModule {}
