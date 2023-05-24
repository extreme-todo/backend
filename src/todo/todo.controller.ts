import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AddTodoDto } from './dto/add-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@Controller('api/todos')
@UseGuards(AuthGuard)
export default class TodoController {
  constructor(private todoService: TodoService) {}

  @Post('/')
  async addTodo(@Body() todoData: AddTodoDto, @CurrentUser() userdata: User) {
    await this.todoService.addTodo(todoData, userdata);
    return 'Successfully created a todo';
  }

  @Delete('/reset')
  resetTodos(@CurrentUser() user: User) {
    return this.todoService.resetTodos(user);
  }

  @Get('/:id')
  async getOneTodo(@Param('id') todoId: number, @CurrentUser() userdata: User) {
    const todo = await this.todoService.getOneTodo(todoId, userdata);
    return todo;
  }

  @Delete('/:id')
  async deleteTodo(@Param('id') todoId: number, @CurrentUser() userdata: User) {
    return this.todoService.deleteTodo(todoId, userdata);
  }

  @Patch('/:id')
  @Serialize(TodoDto)
  async updateTodo(
    @Param('id') todoId: number,
    @Body() updateData: UpdateTodoDto,
    @CurrentUser() userdata: User,
  ) {
    return this.todoService.updateTodo(todoId, updateData, userdata);
  }

  @Patch('/:id/done')
  @Serialize(TodoDto)
  async doTodo(@Param('id') todoId: number, @CurrentUser() userdata: User) {
    return this.todoService.doTodo(todoId, userdata);
  }

  @Get('/')
  getList(@Query('done') isDone: boolean, @CurrentUser() userdata: User) {
    return this.todoService.getList(isDone, userdata);
  }
}
