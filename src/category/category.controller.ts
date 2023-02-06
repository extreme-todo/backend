import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CategoryService } from './category.service';

@Controller('api/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async myCategories(@CurrentUser() user: User) {
    return await this.categoryService.myCategories(user);
  }
}
