import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Ranking } from './entities/ranking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';

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

  async ranking(category: string, user: User) {
    const userRank = await this.repo.findOne({
      where: {
        category: { name: category },
        user: { id: user.id },
      },
    });

    const maxCategory = await this.repo
      .createQueryBuilder()
      .select('MAX(ranking.time)', 'max')
      .where('ranking.category = :category', { category })
      .getRawOne();

    const minCategory = await this.repo
      .createQueryBuilder()
      .select('MIN(ranking.time)', 'min')
      .where('ranking.category = :category', { category })
      .getRawOne();

    const gap = Math.ceil((minCategory + maxCategory) / 10);

    let groupBy = await this.repo
      .createQueryBuilder()
      .select(`count(case when time < ${gap} then 1 end)`, `0~${gap}`)
      .select(
        `count(case when ${gap} <= time and time < ${gap * 2} then 1 end)`,
        `${gap}~${gap * 2}`,
      )
      .select(
        `count(case when ${gap * 2} <= time and time < ${gap * 3} then 1 end)`,
        `${gap * 2}~${gap * 3}`,
      )
      .select(
        `count(case when ${gap * 3} <= time and time < ${gap * 4} then 1 end)`,
        `${gap * 3}~${gap * 4}`,
      )
      .select(
        `count(case when ${gap * 4} <= time and time < ${gap * 5} then 1 end)`,
        `${gap * 4}~${gap * 5}`,
      )
      .select(
        `count(case when ${gap * 5} <= time and time < ${gap * 6} then 1 end)`,
        `${gap * 5}~${gap * 6}`,
      )
      .select(
        `count(case when ${gap * 6} <= time and time < ${gap * 7} then 1 end)`,
        `${gap * 6}~${gap * 7}`,
      )
      .select(
        `count(case when ${gap * 7} <= time and time < ${gap * 8} then 1 end)`,
        `${gap * 7}~${gap * 8}`,
      )
      .select(
        `count(case when ${gap * 8} <= time and time < ${gap * 9} then 1 end)`,
        `${gap * 8}~${gap * 9}`,
      )
      .select(
        `count(case when ${gap * 9} <= time and time < ${gap * 10} then 1 end)`,
        `${gap * 9}~${gap * 10}`,
      )
      .where(`category = :category`, { category })
      .groupBy(`category`)
      .getRawMany();

    const result = {
      group: groupBy,
      user: userRank,
    };
    return result;
  }

  @Cron('0 0 5 * * 1')
  private async deleteRank() {
    return await this.repo.clear();
  }
}
