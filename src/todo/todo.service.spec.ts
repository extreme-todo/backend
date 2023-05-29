import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { mockTodoRepo } from './mock-todo.repository';
import { TodoService } from './todo.service';
import {
  addTodoStub,
  fakeUserHas2Todos,
  fakeUserHasATodo,
  fakeUserHasNoTodo,
  todoStub,
  updateTodoStub,
} from './stubs/todo.stub';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { User } from '../user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { RankingService } from 'src/ranking/ranking.service';

describe('TodoService', () => {
  let service: TodoService;
  const fakeCategoryService = {
    findOrCreateCategories(categories: string[]) {
      return categories.map((x) => ({ name: x } as Category));
    },
  };
  const existingId = todoStub()[0].id;
  const doneId = todoStub()[2].id;
  const notExistingId = 123;
  let mockRepo;

  beforeEach(async () => {
    mockRepo = mockTodoRepo;
    const module = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: CategoryService, useValue: fakeCategoryService },
        { provide: getRepositoryToken(Todo), useValue: mockRepo },
        {
          provide: RankingService,
          useValue: {
            updateRank: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addTodo', () => {
    it('새로운 투두 생성', async () => {
      const res = await service.addTodo(
        addTodoStub(fakeUserHasNoTodo),
        fakeUserHasNoTodo,
      );
      expect(res).toBeDefined();
      expect(res.order).toEqual(0)
    });
    it('미완료 투두를 1개 가진 유저가 새로운 투두 생성', async () => {
      const res = await service.addTodo(
        addTodoStub(fakeUserHas2Todos),
        fakeUserHas2Todos,
      );
      expect(res).toBeDefined();
      expect(res.order).toEqual(1);
    });
    it('카테고리가 5개 초과일 경우 BadRequest', async () => {
      await expect(
        service.addTodo(
          addTodoStub(fakeUserHasNoTodo, 6),
          fakeUserHasNoTodo,
        )
      ).rejects.toThrow(BadRequestException);
    })
  });

  describe('getOneTodo', () => {
    it('존재하는 id에 해당하는 투두 출력', async () => {
      const res = await service.getOneTodo(existingId, fakeUserHasATodo);
      expect(res.id).toEqual(existingId);
    });
    it('해당 todo id가 존재하지 않는 경우 NotFound', async () => {
      await expect(
        service.getOneTodo(notExistingId, fakeUserHasNoTodo),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTodo', () => {
    it('존재하는 id에 해당하는 투두 삭제', async () => {
      const res = await service.deleteTodo(existingId, fakeUserHasATodo);
      expect(res.id).toEqual(existingId);
    });
    it('해당 todo id가 존재하지 않는 경우 NotFound', async () => {
      await expect(
        service.deleteTodo(notExistingId, fakeUserHasNoTodo),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTodo', () => {
    it('존재하는 id에 해당하는 투두 업데이트', async () => {
      const res = await service.updateTodo(
        existingId,
        updateTodoStub(fakeUserHasATodo),
        fakeUserHasATodo,
      );
      expect(res.id).toEqual(existingId);
      expect(res.todo).toEqual('updated');
      expect(res.duration).toEqual(7000);
    });
    it('존재하지 않는 id 업데이트시 NotFound', async () => {
      await expect(
        service.updateTodo(
          notExistingId,
          updateTodoStub(fakeUserHasNoTodo),
          fakeUserHasNoTodo,
        ),
      ).rejects.toThrow(NotFoundException);
    });
    it('카테고리가 5개 초과일 경우 BadRequest', async () => {
      await expect(
        service.updateTodo(
          existingId,
        updateTodoStub(fakeUserHasATodo, 6),
        fakeUserHasATodo,
        )
      ).rejects.toThrow(BadRequestException);
    })
  });

  describe('doTodo', () => {
    const fakeFocusTime = 40000

    it('존재하는 id에 해당하는 투두 완료', async () => {
      const res = await service.doTodo(existingId, fakeUserHasATodo, fakeFocusTime);
      expect(res.done).toEqual(true);
      expect(res.focusTime).toEqual(fakeFocusTime)
    });

    it('존재하지 않는 id 완료시 NotFound', async () => {
      await expect(
        service.doTodo(notExistingId, fakeUserHasNoTodo, fakeFocusTime),
      ).rejects.toThrow(NotFoundException);
    });

    it('완료된 todo일 경우 BadRequest', async () => {
      await expect(
        service.doTodo(doneId, fakeUserHas2Todos, fakeFocusTime),
      ).rejects.toThrow(BadRequestException);
    })

    it('focusTime이 없을 경우 BadRequest', async () => {
      await expect(
        service.doTodo(existingId, fakeUserHasATodo, parseInt(undefined)),
      ).rejects.toThrow(BadRequestException);
    })
  });

  describe('getList', () => {
    const isDone = true;
    it('should be fine', async () => {
      const getTodoList = await service.getList(isDone, fakeUserHas2Todos);
      expect(getTodoList).toHaveLength(1);
    });
  });
});
