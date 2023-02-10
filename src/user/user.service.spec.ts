import { Test, TestingModule } from '@nestjs/testing';
import { mockUserRepo } from './mock-user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let mockRepo;

  beforeEach(async () => {
    mockRepo = mockUserRepo;
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
