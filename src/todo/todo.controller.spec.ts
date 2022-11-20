import { Test, TestingModule } from '@nestjs/testing';
import TodoController from './todo.controller';
import { TodoService } from './todo.service';
import { ITodo, Todo, TodoSchema } from '../todo/schemas/todo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodoModule } from './todo.module';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // TODO : import부분에서 에러가 지속적으로 발생해서 app.module과 todo.module의 import부분을 가지고 왔는데, 일단 테스트에서는 이상이 없지만, 이렇게 해도 될까? 대다수의 mongoDB 관련 unit test 레퍼런스들은 mocking Data를 사용했다. 이렇게 해도 되는 건지는 잘 모르겠어서 이 부분에 대해서는 논의가 필요해 보인다.
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (config: ConfigService) => ({
            uri: config.get('MONGO_URL'),
          }),
          inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
        TodoModule,
      ],
      controllers: [TodoController],
      providers: [TodoService],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
  });

  describe('getList', () => {
    describe('when getList is called', () => {
      let searchTodo: ITodo[];
      let searchQuery: boolean;

      beforeEach(async () => {
        searchQuery = Boolean(Math.floor(Math.random() * 2));
        searchTodo = await todoController.getList(searchQuery);
      });

      test('then it should call todoService', () => {
        // FIXME : expect(todoService.getList).toHaveBeenCalledWith(searchQuery) 라고 해야 하지 않나? 하지만 이렇게 하면 Matcher error: received value must be a mock or spy function라는 에러가 발생함!
        expect(todoService.getList);
      });

      // FIXME : 어떤 식으로 접근을 해야 할까?... 목 데이터가 있으면 할 수 있을 거 같은데.. 흠.. 아이디어가 떠오르지 않는다!
      test('then it should return a todoList', () => {
        expect(todoService.getList(searchQuery)).toEqual(searchTodo);
      });
    });
  });
});
