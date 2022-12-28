import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  RemoveOptions,
  SaveOptions,
} from 'typeorm';
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
  create(entityLike: DeepPartial<Todo>) {
    return { ...entityLike } as Todo;
  },
  save(entity: Todo, options?: SaveOptions) {
    return Promise.resolve(entity);
  },
  findOne(options: FindOneOptions<Todo>) {
    const todos = todoStub();
    console.log('hey..', options);

    if (options.where['id']) {
      return todos.filter((el) => el.id === options.where['id'])[0];
    }
  },
  remove(entity: Todo, options?: RemoveOptions) {
    return Promise.resolve(entity);
  },
};
