import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Todo } from 'src/todo/entities/todo.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  async myCategories(user: User) {
    const categories = await this.repo
      .createQueryBuilder('category')
      .leftJoin('category.todos', 'todo')
      .leftJoin('todo.user', 'user')
      .where('user.id = :id', { id: user.id })
      .select('category.name, category.id')
      .groupBy('category.name')
      .getRawMany();
    return categories;
  }

  async findOrCreateCategories(categories: string[]): Promise<Category[]> {
    if (!categories) return null;
    const newCategories = await Promise.all(
      categories.map(async (category) => {
        const searched = await this.find(category);
        if (searched) return searched;
        else return await this.create(category);
      }),
    );
    return newCategories;
  }

  async find(name: string): Promise<Category> | null {
    const category = await this.repo.findOne({ where: { name } });
    return category;
  }

  async create(name: string) {
    try {
      const category = this.repo.create({ name });
      return await this.repo.save(category);
    } catch (err) {
      throw new BadRequestException('Category already exists');
    }
  }
}
