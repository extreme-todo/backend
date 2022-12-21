import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Todo, TodoSchema } from './schemas/todo.schema';
import TodoController from './todo.controller';
import { TodoModule } from './todo.module';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    // given
    let isDone: boolean;
    let todoList: Todo[];
    beforeEach(() => {
      isDone = Boolean(Math.floor(Math.random() * 2));
      todoList = 
    });
    // when
    describe('when getList is called', () => {
      // then
      it('then it should return todoList that the done value matches', () => {
        expect();
      });
    });
  });
});
