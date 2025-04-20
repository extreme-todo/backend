import { Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { TodoModule } from 'src/todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FocusedTime } from './entities/focused-time.entity';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    TodoModule,
    CategoryModule,
    TypeOrmModule.forFeature([FocusedTime]),
  ],
  controllers: [TimerController],
  providers: [TimerService],
  exports: [TimerService],
})
export class TimerModule {}
