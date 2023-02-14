import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Ranking } from './entities/ranking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RankingService {
  constructor(@InjectRepository(Ranking) private repo: Repository<Ranking>) {}

  async updateRank(category: Category, user: User, time: number) {
    const rank = await this.repo.findOne({
      where: {
        category,
        user: { id: user.id },
      },
    });

    if (!rank) {
      const newRank = this.repo.create({
        user,
        category,
        time,
      });
      return await this.repo.save(newRank);
    }

    Object.assign(rank, { time: rank.time + time });
    return await this.repo.save(rank);
  }

  // search
  ranking(category: Category, user: User) {}

  deleteRank() {}
}
