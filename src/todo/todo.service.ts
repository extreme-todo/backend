import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private repo: Repository<Todo>) {}

  async addTodo(addTodoDto: AddTodoDto, user: User) {
    const newTodo = this.repo.create(addTodoDto);
    newTodo.user = user;
    return await this.repo.save(newTodo);
  }

  async getOneTodo(id: number, user: User) {
    const todo = await this.repo.findOne({ where: { id }, relations: { user: true } });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    if(todo.user?.id !== user.id){
      throw new UnauthorizedException('User has no permission')
    }
    return todo;
  }

  async deleteTodo(id: number, user: User) {
    const todo = await this.getOneTodo(id, user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return this.repo.remove(todo);
  }

  async updateTodo(id: number, updateTodo: UpdateTodoDto, user: User) {
    const todo = await this.getOneTodo(id, user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    Object.assign(todo, updateTodo);
    return this.repo.save(todo);
  }

  async doTodo(id: number, user: User) {
    const todo = await this.getOneTodo(id, user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    todo.done = true;
    return this.repo.save(todo);
  }

  async getList(isDone: boolean, user: User): Promise<Todo[]> {
    return await this.repo.find({ where: { done: isDone, user } });
  }
}
