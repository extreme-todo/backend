import { Todo } from 'src/todo/entities/todo.entity';
import { User } from 'src/user/entities/user.entity';
import { AddTodoDto } from '../dto/add-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

export const fakeUserHasNoTodo = {
  id: 0,
  email: 'fakeUser@email.com',
  username: 'fakeUser',
} as User;

export const fakeUserHasATodo = {
  id: 1,
  email: 'fakeUser1@email.com',
  username: 'fakeUser1',
} as User;

const fakeUser2 = {
  id: 2,
  email: 'fakeUser2@email.com',
  username: 'fakeUser2',
} as User;

export const todoStub = (): Todo[] => {
  return [
    {
      id: 1,
      date: new Date('Dec 27, 2022 18:00:30'),
      todo: 'Go to grocery store',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 60 * 60,
      done: true,
      user: fakeUserHasATodo,
      categories: null,
    },
    {
      id: 2,
      date: new Date('Dec 29, 2022 18:00:30'),
      todo: 'Go to Gym',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 60 * 60,
      done: false,
      user: fakeUser2,
      categories: null,
    },
    {
      id: 3,
      date: new Date('Dec 30, 2022 18:00:30'),
      todo: 'Go to institute',
      createdAt: new Date('Dec 28, 2022 18:00:30'),
      duration: 60 * 60 * 2,
      done: true,
      user: fakeUser2,
      categories: null,
    },
  ];
};

export const addTodoStub = (user: User, categorycount?: number): AddTodoDto => {
  return {
    date: new Date('Dec 30, 2022 18:00:30'),
    todo: 'Go to school',
    duration: 3000,
    categories: Array(categorycount).fill('fakecategory'),
  };
};

export const updateTodoStub = (user: User): UpdateTodoDto => {
  return {
    duration: 7000,
    todo: 'updated',
    categories: ['study'],
  };
};
