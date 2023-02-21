import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AddTodoDto } from './dto/add-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { RankingService } from 'src/ranking/ranking.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private repo: Repository<Todo>,
    private categoryService: CategoryService,
    private rankingService: RankingService,
  ) {}

  async addTodo(addTodoDto: AddTodoDto, user: User) {
    const categories = await this.categoryService.findOrCreateCategories(
      addTodoDto.categories,
    );
    const newTodo = this.repo.create({ ...addTodoDto, categories, user });
    return await this.repo.save(newTodo);
  }

  async getOneTodo(id: number, user: User) {
    const todo = await this.repo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    if (todo.user?.id !== user.id) {
      throw new UnauthorizedException('User has no permission');
    }
    return todo;
  }

  async deleteTodo(id: number, user: User) {
    const todo = await this.getOneTodo(id, user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return this.repo.remove(todo);
  }

  async updateTodo(id: number, updateTodo: UpdateTodoDto, user: User) {
    const todo = await this.getOneTodo(id, user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    if (updateTodo?.categories) {
      const newCategories = await this.categoryService.findOrCreateCategories(
        updateTodo.categories,
      );
      Object.assign(todo, { ...updateTodo, categories: newCategories });
    } else {
      Object.assign(todo, updateTodo);
    }
    return this.repo.save(todo);
  }

  async doTodo(id: number, user: User) {
    const todo = await this.getOneTodo(id, user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    todo.done = true;
    if (todo?.categories) {
      todo.categories.forEach(async (category) => {
        await this.rankingService.updateRank(category, user, todo.duration);
      });
    }
    return this.repo.save(todo);
  }

  async getList(isDone: boolean, user: User): Promise<Todo[]> {
    return await this.repo.find({
      relations: { categories: true },
      where: { done: isDone, user: { id: user.id } },
    });
  }

  // @Cron('0 0 5 * * 1')
  async removeTodo() {
    const staleTodos = await this.repo
      .createQueryBuilder('todo')
      .select('*')
      .where('todo.date < :date', { date: new Date() })
      .getRawMany();
    return await this.repo.remove(staleTodos);
  }
}
