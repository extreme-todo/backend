import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { mockTodoRepo } from './mock-todo.repository';
import { TodoService } from './todo.service';
import { addTodoStub, todoStub, updateTodoStub } from './stubs/todo.stub';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let service: TodoService;
  const existingId = todoStub()[0].id;
  const notExistingId = 123;
  let mockRepo;

  beforeEach(async () => {
    mockRepo = mockTodoRepo;
    const module = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: getRepositoryToken(Todo), useValue: mockRepo },
      ],
    }).compile();

    service = module.get(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addTodo', () => {
    it('새로운 투두 생성', async () => {
      const res = service.addTodo(addTodoStub());
      expect(res).toBeDefined();
    });
  });

  describe('getOneTodo', () => {
    it('존재하는 id에 해당하는 투두 출력', async () => {
      const res = await service.getOneTodo(existingId);
      console.log(res);
      expect(res.id).toEqual(existingId);
    });
    it('해당 todo id가 존재하지 않는 경우 NotFound', async () => {
      await expect(service.getOneTodo(notExistingId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTodo', () => {
    it('존재하는 id에 해당하는 투두 삭제', async () => {
      const res = await service.deleteTodo(existingId);
      expect(res.id).toEqual(existingId);
    });
    it('해당 todo id가 존재하지 않는 경우 NotFound', async () => {
      await expect(service.deleteTodo(notExistingId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTodo', () => {
    it('존재하는 id에 해당하는 투두 업데이트', async () => {
      const res = await service.updateTodo(existingId, updateTodoStub());
      expect(res.id).toEqual(existingId);
      expect(res.todo).toEqual('updated');
      expect(res.duration).toEqual(7000);
    });
    it('존재하지 않는 id 업데이트시 NotFound', async () => {
      await expect(
        service.updateTodo(notExistingId, updateTodoStub()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('doTodo', () => {
    it('존재하는 id에 해당하는 투두 완료', async () => {
      const res = await service.doTodo(existingId);
      expect(res.done).toEqual(true);
    });
    it('존재하지 않는 id 완료시 NotFound', async () => {
      await expect(service.doTodo(notExistingId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getList', () => {
    const isDone = true;
    it('should be fine', async () => {
      const getTodoList = await service.getList(isDone);
      expect(getTodoList).toHaveLength(2);
    });
  });
});
