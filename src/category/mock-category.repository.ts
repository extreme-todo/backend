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
  createQueryBuilder: jest.fn(() => {
    return {
      where: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        { id: 1, name: 'fakeCategory1' },
        { id: 2, name: 'fakeCategory2' },
      ]),
    };
  }),
};
