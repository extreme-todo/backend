import { Test, TestingModule } from '@nestjs/testing';
import { DeepPartial, FindOneOptions, SaveOptions } from 'typeorm';
import { RankingService } from './ranking.service';
import { rankingStub } from './stubs/ranking.stub';
import { Ranking } from './entities/ranking.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RankingService', () => {
  let service: RankingService;
  let mockRanking: Ranking[];
  let mockRankRepo;

  beforeEach(async () => {
    mockRanking = rankingStub();
    mockRankRepo = {
      findOne(options?: FindOneOptions<Ranking>) {
        if (options?.where) {
          const keys = Object.keys(options.where);
          let res: Ranking[] = [...mockRanking];
          keys.forEach((key) => {
            if (key !== 'user')
              res = res.filter((el) => el[key] === options.where[key]);
            else {
              res = res.filter((el) => el.user.id === options.where[key].id);
            }
          });
          return res[0];
        }
        return null;
      },
      create(entityLike: DeepPartial<Ranking>) {
        const newRank = {
          id: 10,
          time: entityLike.time,
          user: entityLike.user,
          category: entityLike.category,
        } as Ranking;
        mockRanking.push(newRank);
        return newRank;
      },
      save(entity: Ranking, options?: SaveOptions) {
        return Promise.resolve(entity);
      },
      createQueryBuilder: jest.fn().mockImplementation(() => {
        return {
          where: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          groupBy: jest.fn().mockReturnThis(),
          getRawOne: jest.fn(),
          getRawMany: jest.fn(),
        };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        { provide: getRepositoryToken(Ranking), useValue: mockRankRepo },
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 업데이트 할 때..
  describe('updateRank', () => {
    it('todo가 완료 됐을 때 해당 유저가 그 카테고리에 해당하는 시간 업데이트', async () => {
      const beforeRanking = mockRanking[0];
      const beforeTime = beforeRanking.time;

      const result = await service.updateRank(
        beforeRanking.category,
        beforeRanking.user,
        beforeTime,
      );

      expect(result.time).toBeGreaterThan(beforeTime);
    });
  });

  // 랭킹 정보가 필요할 때..
  describe('ranking', () => {
    it('주어진 유저의 주어진 카테고리에 해당하는 시간을 반환', async () => {
      const searchRank = mockRanking[0];
      const resultRank = await service.ranking(
        searchRank.category,
        searchRank.user,
      );

      expect(resultRank).toBeDefined();
    });
  });
});
