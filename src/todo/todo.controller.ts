import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

// TODO : AuthGuard 필요함!
@Controller('todos')
export default class TodoController {
  constructor(private todoService: TodoService) {}

  @Post('/')
  addTodo(@Body() todoData: AddTodoDto): string {
    const newTodo = this.todoService.addTodo(todoData);
    return 'yes...';
  }

  @Get('/:id')
  async getOneTodo(@Param('id') todoId: number) {
    const todo = await this.todoService.getOneTodo(todoId);
    return todo;
  }

  @Delete('/:id')
  async deleteTodo(@Param('id') todoId: number) {
    return this.todoService.deleteTodo(todoId);
  }

  @Patch('/:id')
  async updateTodo(
    @Param('id') todoId: number,
    @Body() updateData: UpdateTodoDto,
  ) {
    return this.todoService.updateTodo(todoId, updateData);
  }

  @Patch('/:id/done')
  async doTodo(@Param('id') todoId: number) {
    return this.todoService.doTodo(todoId);
  }

  @Get()
  async getList(@Query('done') isDone: boolean) {
    return this.todoService.getList(isDone);
  }
}
