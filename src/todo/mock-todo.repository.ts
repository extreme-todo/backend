import { FindManyOptions } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { todoStub } from './stubs/todo.stub';

export const mockTodoRepo = {
  find(where: FindManyOptions<Todo>) {
    const todos = todoStub();
    if (where.where['id']) {
      return todos.filter((el) => el.id === where.where['id']);
    }
    if (where.where['done']) {
      return todos.filter((el) => el.done === where.where['done']);
    }
  },
};
