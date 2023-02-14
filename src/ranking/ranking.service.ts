import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Ranking } from './entities/ranking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RankingService {
  constructor(@InjectRepository(Ranking) private repo: Repository<Ranking>) {}

  updateRank() {}

  ranking() {}

  deleteRank() {}
}
