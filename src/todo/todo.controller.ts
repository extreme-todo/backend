import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { isBoolean } from 'class-validator';
import mongoose from 'mongoose';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@Controller('api/todo')
export default class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/')
  addTodo(@Body() todoData: AddTodoDto): string {
    const newTodo = this.todoService.addTodo(todoData);
    return 'yes...';
  }

  @Get('/:id')
  async getOneTodo(@Param('id') todoId: string) {
    const todo = await this.todoService.getOneTodo(todoId);
    return todo;
  }

  @Delete('/:id')
  async deleteTodo(@Param('id') todoId: string) {
    return await this.todoService.deleteTodo(todoId);
  }

  @Patch('/:id')
  async updateTodo(
    @Param('id') todoId: string,
    @Body() updateData: UpdateTodoDto,
  ) {
    return await this.todoService.updateTodo(todoId, updateData);
  }

  @Patch('/:id/done')
  async doTodo(@Param('id') todoId: string) {
    return await this.todoService.doTodo(todoId);
  }

  // TODO : 테스트 코드 짜야 되는데, 일단 그 전에 localhost:8000 들어갔을 때에도 반응이 없음
  @Get('/api/todos?done')
  async getList(@Query('done') isDone: boolean) {
    return await this.todoService.getList(isDone);
  }
}
