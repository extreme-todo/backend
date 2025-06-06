import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { RankingModule } from 'src/ranking/ranking.module';
import { Todo } from './entities/todo.entity';
import TodoController from './todo.controller';
import { TodoService } from './todo.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TimerModule } from 'src/timer/timer.module';

@Module({
  imports: [
    CategoryModule,
    TypeOrmModule.forFeature([Todo]),
    RankingModule,
    ScheduleModule.forRoot(),
    TimerModule,
  ],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}
