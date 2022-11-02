import { Test, TestingModule } from '@nestjs/testing';
import TodoController from './todo.controller';
import { TodoService } from './todo.service';
import { Todo, TodoSchema } from '../todo/schemas/todo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodoModule } from './todo.module';

describe('TodoController', () => {
  let controller: TodoController;

  beforeAll(async () => {
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

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getList', () => {
    it('should be return array', async () => {
      const res = await controller.getList(false);
      // TODO : 그냥 Array의 instance가 아니라 더 명확한 타입이 필요하지 않을까?
      expect(res).toBeInstanceOf(Array);
    });
  });
});
