import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
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
}
