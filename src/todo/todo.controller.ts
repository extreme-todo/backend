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
import { ReorderDto } from './dto/reorder.dto';

@Controller('api/todos')
@UseGuards(AuthGuard)
export default class TodoController {
  constructor(private todoService: TodoService) {}

  @Get('/done-today')
  getDoneToday(
    @CurrentUser() userdata: User,
    @Query('timezoneOffset') offset: string,
  ) {
    const timezoneOffset = parseInt(offset, 10); // in minutes
    return this.todoService.getTodayDoneTodos(userdata, timezoneOffset);
  }

  @Post('/')
  async addTodo(@Body() todoData: AddTodoDto, @CurrentUser() userdata: User) {
    await this.todoService.addTodo(todoData, userdata);
    return 'Successfully created a todo';
  }

  @Patch('/reorder')
  @UseGuards(AuthGuard)
  reorderTodos(
    @CurrentUser() userdata: User,
    @Query() { prevOrder, newOrder }: ReorderDto,
  ) {
    return this.todoService.reorderTodos(prevOrder, newOrder, userdata.id);
  }

  @Delete('/reset')
  resetTodos(@CurrentUser() user: User) {
    return this.todoService.resetTodos(user);
  }

  @Get('/:id')
  async getOneTodo(@Param('id') todoId: string, @CurrentUser() userdata: User) {
    const todo = await this.todoService.getOneTodo(todoId, userdata);
    return todo;
  }

  @Delete('/:id')
  async deleteTodo(@Param('id') todoId: string, @CurrentUser() userdata: User) {
    const deleted = await this.todoService.deleteTodo(todoId, userdata);
    return this.todoService.removeTodoOrder(deleted.order, userdata.id);
  }

  @Patch('/:id')
  @Serialize(TodoDto)
  async updateTodo(
    @Param('id') todoId: string,
    @Body() updateData: UpdateTodoDto,
    @CurrentUser() userdata: User,
  ) {
    return this.todoService.updateTodo(todoId, updateData, userdata);
  }

  @Patch('/:id/done')
  @UseGuards(AuthGuard)
  async doTodo(
    @Param('id') todoId: string,
    @CurrentUser() userdata: User,
    @Query('focusTime') focusTime: string,
  ) {
    const { prevOrder } = await this.todoService.doTodo(
      todoId,
      userdata,
      parseInt(focusTime),
    );

    await this.todoService.removeTodoOrder(prevOrder, userdata.id);

    return 'Successfully done a todo';
  }

  @Get('/')
  async getList(@Query('done') isDone: boolean, @CurrentUser() userdata: User) {
    return await this.todoService.getList(isDone, userdata);
  }

  @Delete('/')
  async removeDidntDo(
    @CurrentUser() userdata: User,
    @Query('currentDate') currentDate: string,
    // TODO : 고려할 점: 사용자가 date를 임의로 넣어서 api요청을 하는 경우를 막을 수 없음.
  ) {
    await this.todoService.removeDidntDo(currentDate, userdata);
    return 'Successfully removed todos before today';
  }
}
