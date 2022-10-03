import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo')
export default class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/')
  getOneTodo(): string {
    return 'hello';
  }

  @Post('/')
  addTodo(): string {
    return 'new';
  }

  @Delete('/:id')
  deleteTodo(@Param('id') todoId: number): string {
    return `delete ${todoId}`;
  }

  @Patch('/:id')
  patchTodo(@Param('id') todoId: number) {
    return `patch ${todoId}`;
  }

  @Patch('/:id/done')
  doTodo(@Param('id') todoId: number): string {
    return `do ${todoId}`;
  }
}
