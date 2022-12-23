import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import TodoController from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [
    // ConfigModule,
    TypeOrmModule.forFeature([Todo]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
