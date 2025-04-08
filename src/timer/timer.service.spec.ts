import { Test, TestingModule } from '@nestjs/testing';
import { TimerService } from './timer.service';
import { TodoService } from 'src/todo/todo.service';
import { Todo } from 'src/todo/entities/todo.entity';
import { User } from 'src/user/entities/user.entity';
import { fakeUserHasNoTodo } from 'src/todo/stubs/todo.stub';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FocusedTime } from './entities/focused-time.entity';
import { CategoryService } from 'src/category/category.service';
import { TimeUnit } from './dto/get-focused-time.dto';

describe('TimerService', () => {
  let service: TimerService;
  let currentDate = new Date('2023-08-29T15:00:00Z'); // Client timezone이 KST일 경우 자정은 UTC 15시이다. KST 8월 30일
  let fakeUser: User = fakeUserHasNoTodo;
  let mockFocusedTimeRepository: any;
  let mockCategoryService: any;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    mockFocusedTimeRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockCategoryService = {
      findById: jest.fn(),
    };

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
        {
          provide: getRepositoryToken(FocusedTime),
          useValue: mockFocusedTimeRepository,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get(TimerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('KST 8월 30일까지 60일동안 매일 1000ms 씩 집중한 경우', () => {
    it('오늘이 KST 8월 30일인 경우 daily, monthly가 0이다. 월요일이 한 주의 시작이며, 8월 30일은 수요일이므로 저번주에 7000, 이번주에 3000만큼 집중하여 weekly=-4000이 된다.', async () => {
      const res = await service.getProgress(
        fakeUser,
        currentDate.toISOString(),
        +540, // KST offset
      );
      expect(res.daily).toEqual(0);
      expect(res.weekly).toEqual(-4000);
      expect(res.monthly).toEqual(0);
    });
    it('오늘이 KST 9월 1일인 경우 오늘과 어제 한 일이 없으므로 daily=0, weekly=-4000, monthly=-30000', async () => {
      const res = await service.getProgress(
        fakeUser,
        '2023-08-31T15:00:00Z', // KST 9월 1일 0시
        +540, // KST offset
      );
      expect(res.daily).toEqual(0);
      expect(res.weekly).toEqual(-4000);
      expect(res.monthly).toEqual(-30000);
    });
  });

  describe('카테고리별 집중 시간 조회', () => {
    const mockCategory = { id: 1, name: 'Test Category' };
    const mockFocusedTimeRecords = [
      {
        createdAt: new Date('2025-04-04T18:30:00Z'), // KST 4월 5일 3시
        updatedAt: new Date('2025-04-04T18:30:00Z'), 
        duration: 120,  
      },
      {
        createdAt: new Date('2025-04-05T05:00:00Z'), // KST 4월 5일  14시
        updatedAt: new Date('2025-04-05T05:00:00Z'), 
        duration: 120,      
      },
    ];

    beforeEach(() => {
      mockCategoryService.findById.mockResolvedValue(mockCategory);
      mockQueryBuilder.getMany.mockResolvedValue(mockFocusedTimeRecords);
    });

    it('일 단위로 조회할 경우 2시간 간격으로 12개의 구간이 반환되어야 한다', async () => {
      const {values, total} = await service.getFocusedTimeByUnit(fakeUser, TimeUnit.DAY, +540, 1);
      
      expect(total.focused).toEqual(240);

      expect(values).toHaveLength(12);
      // 첫 번째 구간 (0-2시)에는 0분의 집중 시간이 있다
      expect(values[0]).toEqual({ start: 0, end: 2, focused: 0 });
      // 두 번째 구간 (2-4시)에는 0분의 집중 시간이 있다
      expect(values[1]).toEqual({ start: 2, end: 4, focused: 120 });
      // 세 번째 구간 (4-6시)에는 0분의 집중 시간이 있다
      expect(values[2]).toEqual({ start: 4, end: 6, focused: 0 });
      // 네 번째 구간 (6-8시)에는 0분의 집중 시간이 있다
      expect(values[3]).toEqual({ start: 6, end: 8, focused: 0 });
      // 다섯 번째 구간 (8-10시)에는 0분의 집중 시간이 있다
      expect(values[4]).toEqual({ start: 8, end: 10, focused: 0 });
      // 여섯 번째 구간 (10-12시)에는 0분의 집중 시간이 있다
      expect(values[5]).toEqual({ start: 10, end: 12, focused: 0 });
      // 일곱 번째 구간 (12-14시)에는 120분의 집중 시간이 있다
      expect(values[6]).toEqual({ start: 12, end: 14, focused: 0 });
      // 여덟 번째 구간 (14-16시)에는 120분의 집중 시간이 있다
      expect(values[7]).toEqual({ start: 14, end: 16, focused: 120 });
      // 아홉 번째 구간 (16-18시)에는 0분의 집중 시간이 있다    
      expect(values[8]).toEqual({ start: 16, end: 18, focused: 0 });
      // 열 번째 구간 (18-20시)에는 0분의 집중 시간이 있다
      expect(values[9]).toEqual({ start: 18, end: 20, focused: 0 });
      // 열한 번째 구간 (20-22시)에는 0분의 집중 시간이 있다
      expect(values[10]).toEqual({ start: 20, end: 22, focused: 0 });
      // 열두 번째 구간 (22-24시)에는 0분의 집중 시간이 있다
      expect(values[11]).toEqual({ start: 22, end: 24, focused: 0 });
    });

    it('주 단위로 조회할 경우 일요일부터 토요일까지 7개의 구간이 반환되어야 한다', async () => {
      const {values, total} = await service.getFocusedTimeByUnit(fakeUser, TimeUnit.WEEK, +540, 1);

      expect(total.focused).toEqual(240);

      expect(values).toHaveLength(7);
      // 요일은 일요일부터 토요일까지 순서대로 정렬된다
      expect(values[0]).toEqual({ day: 'sun', focused: 0 });
      expect(values[1]).toEqual({ day: 'mon', focused: 0 });
      expect(values[2]).toEqual({ day: 'tue', focused: 0 });
      expect(values[3]).toEqual({ day: 'wed', focused: 0 }); // 120 + 120분
      expect(values[4]).toEqual({ day: 'thu', focused: 0 });
      expect(values[5]).toEqual({ day: 'fri', focused: 0 });
      expect(values[6]).toEqual({ day: 'sat', focused: 240 });
    });

    it('월 단위로 조회할 경우 5개의 주가 반환되어야 한다', async () => {
      const {values, total} = await service.getFocusedTimeByUnit(fakeUser, TimeUnit.MONTH, +540, 1);

      expect(total.focused).toEqual(240);

      expect(values).toHaveLength(5);
      expect(values[0]).toEqual({ week: 1, focused: 240 });
      expect(values[1]).toEqual({ week: 2, focused: 0 });
      expect(values[2]).toEqual({ week: 3, focused: 0 });
      expect(values[3]).toEqual({ week: 4, focused: 0 }); // 집중 시간은 5주차에 있다
      expect(values[4]).toEqual({ week: 5, focused: 0 }); // 120 + 120분
    });
  });
});
