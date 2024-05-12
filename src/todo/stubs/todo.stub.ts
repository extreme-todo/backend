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

export const fakeUserHas2Todos = {
  id: 2,
  email: 'fakeUser2@email.com',
  username: 'fakeUser2',
} as User;

export const fakeUserHas5Todos = {
  id: 3,
  email: 'fakeUser3@email.com',
  username: 'fakeUser3',
} as User;

export const todoStub = (): Todo[] => {
  return [
    {
      id: 1,
      // date: new Date('Dec 27, 2022 18:00:30').toISOString().split('T')[0], // 이렇게 할려고 하니 string 타입이 되어 에러가 발생하는데, 타입을 어떻게 해야할까?
      date: new Date('Dec 27, 2022 18:00:30'),
      todo: 'Go to grocery store',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 60 * 60,
      done: false,
      user: fakeUserHasATodo,
      categories: null,
      focusTime: 0,
      order: 1,
    },
    {
      id: 2,
      date: new Date('Dec 29, 2022 18:00:30'),
      todo: 'Go to Gym',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 60 * 60,
      done: false,
      user: fakeUserHas2Todos,
      categories: null,
      focusTime: 0,
      order: 1,
    },
    {
      id: 3,
      date: new Date('Dec 30, 2022 18:00:30'),
      todo: 'Go to institute',
      createdAt: new Date('Dec 28, 2022 18:00:30'),
      duration: 60 * 60 * 2,
      done: true,
      user: fakeUserHas2Todos,
      categories: null,
      focusTime: 0,
      order: null,
    },
    {
      id: 4,
      date: new Date('Dec 27, 2022 18:00:30'),
      todo: 'Go to grocery store',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 60 * 60,
      done: false,
      user: fakeUserHas5Todos,
      categories: null,
      focusTime: 0,
      order: 1,
    },
    {
      id: 5,
      date: new Date('Dec 27, 2022 18:00:30'),
      todo: 'write test code',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 60 * 60,
      done: false,
      user: fakeUserHas5Todos,
      categories: null,
      focusTime: 0,
      order: 2,
    },
    {
      id: 6,
      date: new Date('Dec 27, 2022 18:00:30'),
      todo: 'work ET',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 60 * 60,
      done: false,
      user: fakeUserHas5Todos,
      categories: null,
      focusTime: 0,
      order: 3,
    },
    {
      id: 7,
      date: new Date('Dec 27, 2022 18:00:30'),
      todo: 'go to gym',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 60 * 60,
      done: false,
      user: fakeUserHas5Todos,
      categories: null,
      focusTime: 0,
      order: 4,
    },
    {
      id: 8,
      date: new Date('Dec 27, 2022 18:00:30'),
      todo: 'Go to grocery store',
      createdAt: new Date('Dec 26, 2022 18:00:30'),
      duration: 60 * 60,
      done: false,
      user: fakeUserHas5Todos,
      categories: null,
      focusTime: 0,
      order: 5,
    },
  ];
};

export const addTodoStub = (user: User, categorycount?: number): AddTodoDto => {
  return {
    date: new Date('Dec 30, 2022 18:00:30'),
    todo: 'Go to school',
    duration: 3000,
    categories: Array(categorycount ?? 1).fill('fakecategory'),
  };
};

export const updateTodoStub = (
  user: User,
  categorycount?: number,
): UpdateTodoDto => {
  return {
    duration: 7000,
    todo: 'updated',
    categories: Array(categorycount ?? 1).fill('fakecategory'),
    date: new Date('2024-05-15'),
  };
};
