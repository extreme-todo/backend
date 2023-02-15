import { User } from 'src/user/entities/user.entity';
import { Category } from '../entities/category.entity';

export const fakeUserHasNoCategory = {
  id: 0,
  email: 'fakeUser@email.com',
  username: 'fakeUser',
} as User;

export const fakeUserHasACategory_1 = {
  id: 1,
  email: 'fakeUser1@email.com',
  username: 'fakeUser1',
} as User;

export const fakeUserHasACategory_2 = {
  id: 2,
  email: 'fakeUser2@email.com',
  username: 'fakeUser2',
} as User;

export const categoryStub = (): Category[] => {
  return [
    {
      id: 1,
      name: 'math',
      todos: [],
      ranking: [],
    },
    {
      id: 2,
      name: 'english',
      todos: [],
      ranking: [],
    },
  ];
};
