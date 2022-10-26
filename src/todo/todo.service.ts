import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from './schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async addTodo(todoData: AddTodoDto): Promise<any> {
    const res = new this.todoModel(todoData);
    return await res.save();
  }

  async getOneTodo(id: string) {
    const todo = await this.todoModel.find({ _id: id });
    console.log(todo);
    return todo;
  }

  async deleteTodo(id: string) {
    const res = await this.todoModel.findOneAndDelete({ _id: id });
    return res;
  }

  async updateTodo(id: string, updateData: UpdateTodoDto) {
    const res = await this.todoModel.findByIdAndUpdate(id, updateData);
    console.log(res);
    return res;
  }

  async doTodo(id: string) {
    const res = await this.todoModel.findByIdAndUpdate(id, { done: true });
    console.log(res);
    return res;
  }

  // TODO : async getList(isDone: boolean): Promise<T> 처럼 return에 대한 type을 안해도 될까? 안해도 돌아는 가지만 하는 게 맞는 거 같은데?
  async getList(isDone: boolean) {
    const res = await this.todoModel.find({ done: isDone });
    return res;
  }
}
