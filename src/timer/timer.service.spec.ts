import { Test, TestingModule } from '@nestjs/testing';
import { TimerService } from './timer.service';
import { TodoService } from 'src/todo/todo.service';
import { Todo } from 'src/todo/entities/todo.entity';
import { User } from 'src/user/entities/user.entity';
import { fakeUserHasNoTodo } from 'src/todo/stubs/todo.stub';

describe('TimerService', () => {
  let service: TimerService;
  let currentDate = new Date('2023-08-29T15:00:00Z'); // Client timezone이 KST일 경우 자정은 UTC 15시이다. KST 8월 30일
  let fakeUser: User = fakeUserHasNoTodo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TimerService,
        {
          provide: TodoService,
          useValue: {
            getList: jest.fn(() => {
              const todos: Todo[] = [];
              for (let i = 0; i < 60; i++) {
                todos.push({
                  id: i.toString(),
                  createdAt: new Date(),
                  date: new Date(
                    currentDate.getTime() - 1000 * 60 * 60 * 24 * i,
                  ),
                  todo: `fakeTodo${i}`,
                  duration: 0,
                  done: true,
                  focusTime: 1000,
                  user: fakeUser,
                  categories: [],
                  order: null,
                });
              }
              return todos;
            }),
          },
        },
      ],
    }).compile();

    service = module.get(TimerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('KST 8월 30일까지 60일동안 매일 1000ms 씩 집중한 경우', () => {
    it('오늘이 KST 8월 30일인 경우 daily, weekly, monthly가 모두 0이다.', async () => {
      const res = await service.getProgress(
        fakeUser,
        currentDate.toISOString(),
        -540, // KST offset
      );
      expect(res.daily).toEqual(0);
      expect(res.weekly).toEqual(0);
      expect(res.monthly).toEqual(0);
    });
    it('오늘이 KST 9월 1일인 경우 오늘과 어제 한 일이 없으므로 daily=0, weekly=-2000, monthly=-30000', async () => {
      const res = await service.getProgress(
        fakeUser,
        '2023-08-31T15:00:00Z', // KST 9월 1일 0시
        -540, // KST offset
      );
      expect(res.daily).toEqual(0);
      expect(res.weekly).toEqual(-2000);
      expect(res.monthly).toEqual(-30000);
    });
  });
});
