import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  SaveOptions,
} from 'typeorm';
import { Category } from './entities/category.entity';
import { categoryStub } from './stubs/category.stub';

export const mockCategoryRepo = {
  find(options?: FindManyOptions<Category>) {
    const categories = categoryStub();

    if (options?.where) {
      const keys = Object.keys(options.where);
      let res: Category[] = [...categories];
      keys.forEach((key) => {
        if (key !== 'author')
          res = res.filter((el) => el[key] === options.where[key]);
        else {
          res = res.filter((el) => el.author.id === options.where[key].id);
        }
      });
      return res;
    }

    return [];
  },
  findOne(options?: FindOneOptions<Category>) {
    const categories = categoryStub();

    if (options?.where) {
      const keys = Object.keys(options.where);
      let res: Category[] = [...categories];
      keys.forEach((key) => {
        res = res.filter((el) => el[key] === options.where[key]);
      });
      return res[0];
    }
    return null;
  },
  create(entityLike: DeepPartial<Category>) {
    return { ...entityLike } as Category;
  },
  save(entity: Category, options?: SaveOptions) {
    return Promise.resolve(entity);
  },
};
