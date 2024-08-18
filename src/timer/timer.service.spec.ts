import { Test, TestingModule } from '@nestjs/testing';
import { TimerService } from './timer.service';
import { TodoModule } from 'src/todo/todo.module';

describe('TimerService', () => {
  let service: TimerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TodoModule],
      providers: [TimerService],
    }).compile();

    service = module.get(TimerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
