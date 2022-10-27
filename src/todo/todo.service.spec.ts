import { Test, TestingModule } from '@nestjs/testing';
import { describe } from 'node:test';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService],
    }).compile();
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    it('should be return array', async () => {
      const res = await service.getList(false);
      expect(res).toBeInstanceOf(Array);
    });
  });
});
