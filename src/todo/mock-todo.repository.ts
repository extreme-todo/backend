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
    if (where.where) {
      const keys = Object.keys(where.where);
      let res: Todo[] = [...todos];
      keys.forEach((key) => {
        if(key!=='user')
          res = res.filter((el) => el[key] === where.where[key]);
        else
          res = res.filter((el) => el[key].id === where.where[key].id)
      });
      return res;
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

    if (options.where['id']) {
      return todos.filter((el) => el.id === options.where['id'])[0];
    }
  },
  remove(entity: Todo, options?: RemoveOptions) {
    return Promise.resolve(entity);
  },
};
