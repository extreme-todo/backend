import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

export interface ITodo {
  todo: string;
  duration: number;
  done: boolean;
  category: string;
}

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private repo: Repository<Todo>) {}

  addTodo(addTodoDto: AddTodoDto) {
    const newTodo = this.repo.create(addTodoDto);
    return this.repo.save(newTodo);
  }

  getOneTodo(id: number) {
    if (!id) {
      console.log('id가 없습니다.');
      return null;
    }
    const todo = this.repo.findOne({ where: { id } });
    return todo;
  }

  async deleteTodo(id: number) {
    const todo = await this.getOneTodo(id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return this.repo.remove(todo);
  }

  async updateTodo(id: number, updateTodo: UpdateTodoDto) {
    const todo = await this.getOneTodo(id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    Object.assign(todo, updateTodo);
    return this.repo.save(todo);
  }

  async doTodo(id: number) {
    const todo = await this.getOneTodo(id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    todo.done = true;
    return this.repo.save(todo);
  }

  getList(isDone: boolean): Promise<ITodo[]> {
    const todoList = this.repo.find({ where: { done: isDone } });
    return todoList;
  }
}
