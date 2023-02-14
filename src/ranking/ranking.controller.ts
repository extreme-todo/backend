import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/entities/user.entity';
import { RankingService } from './ranking.service';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';

@Controller('/api/ranking')
@UseGuards(AuthGuard)
export class RankingController {
  constructor(private rankingService: RankingService) {}

  @Get('')
  ranking(@Query('category') category: string, @CurrentUser() user: User) {
    return this.rankingService.ranking(category, user);
  }
}
