import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { RankingModule } from 'src/ranking/ranking.module';
import { Todo } from './entities/todo.entity';
import TodoController from './todo.controller';
import { TodoService } from './todo.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TodoSchedulerService } from './todo-scheduler.service';

@Module({
  imports: [
    CategoryModule,
    TypeOrmModule.forFeature([Todo]),
    RankingModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [TodoController],
  providers: [TodoService, TodoSchedulerService],
  exports: [TodoService],
})
export class TodoModule {}
