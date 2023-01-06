import { Todo } from 'src/todo/entities/todo.entity';
import { AddTodoDto } from '../dto/add-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

export const todoStub = (): Todo[] => {
  return [
    {
      id: 1,
      date: new Date('Dec 27, 2022 18:00:30'),
      todo: 'Go to grocery store',
      duration: 60 * 60,
      done: true,
      category: '["chore", "family affair"]',
    },
    {
      id: 2,
      date: new Date('Dec 29, 2022 18:00:30'),
      todo: 'Go to Gym',
      duration: 60 * 60,
      done: false,
      category: '["health"]',
    },
    {
      id: 3,
      date: new Date('Dec 30, 2022 18:00:30'),
      todo: 'Go to institute',
      duration: 60 * 60 * 2,
      done: true,
      category: '["study", "math"]',
    },
  ];
};

export const addTodoStub = (): AddTodoDto => {
  return {
    date: new Date('Dec 30, 2022 18:00:30'),
    todo: 'Go to school',
    duration: 3000,
    category: JSON.stringify(['study']),
  };
};

export const updateTodoStub = (): UpdateTodoDto => {
  return {
    duration: 7000,
    todo: 'updated',
  };
};
