import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { mockTodoRepo } from './mock-todo.repository';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: getRepositoryToken(Todo), useValue: mockTodoRepo },
      ],
    }).compile();

    service = module.get(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    const isDone = true;
    it('should be fine', async () => {
      const getTodoList = await service.getList(isDone);
      expect(getTodoList).toHaveLength(2);
    });
  });
});
