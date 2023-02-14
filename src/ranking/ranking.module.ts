import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ranking])],
  providers: [RankingService],
  controllers: [RankingController],
})
export class RankingModule {}
