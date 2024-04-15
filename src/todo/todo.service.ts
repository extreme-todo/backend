import {
  BadRequestException,
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

const MAX_CATEGORY_LENGTH = 5;

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private repo: Repository<Todo>,
    private categoryService: CategoryService,
    private rankingService: RankingService,
  ) {}

  async addTodo(addTodoDto: AddTodoDto, user: User) {
    if (addTodoDto.categories.length > MAX_CATEGORY_LENGTH) {
      throw new BadRequestException(
        `등록 가능한 카테고리 개수 ${MAX_CATEGORY_LENGTH}개를 초과했습니다.`,
      );
    }

    const categories = await this.categoryService.findOrCreateCategories(
      addTodoDto.categories,
    );

    let newTodoOrder: number;

    const todos = await this.repo.find({
      where: { done: false, user: { id: user.id } },
      order: { order: 'DESC' },
    });

    if (todos.length === 0) {
      newTodoOrder = 1;
    } else {
      const searchData = todos.find(
        (todo) => new Date(todo.date) <= new Date(addTodoDto.date),
      );

      if (searchData === undefined) {
        newTodoOrder = 1;

        const plusedTodos = this.plusOrder(todos);

        await this.repo.save(plusedTodos);
      } else {
        newTodoOrder = searchData.order + 1;
        const plusedTodos = this.plusOrder(todos.slice(searchData.order));
        await this.repo.save(plusedTodos);
      }
    }

    const newTodoData = {
      ...addTodoDto,
      categories,
      user,
      order: newTodoOrder,
    };

    const newTodo = this.repo.create(newTodoData);

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

  async removeTodoOrder(todoOrder: number, userId: number): Promise<Todo[]> {
    const todos = await this.repo
      .createQueryBuilder('todo')
      .select('*')
      .where('todo.order > :todoOrder', { todoOrder })
      .andWhere('todo.userId = :userId', { userId })
      .orderBy({ 'todo.order': 'ASC' })
      .getRawMany();

    const updated = this.minusOrder(todos);

    return this.repo.save(updated);
  }

  async deleteTodo(id: number, user: User) {
    const todo = await this.getOneTodo(id, user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return this.repo.remove(todo);
  }

  minusOrder(todos: Todo[]): Todo[] {
    return todos.map((todo) => {
      todo.order -= 1;
      return todo;
    });
  }

  plusOrder(todos: Todo[]): Todo[] {
    return todos.map((todo) => {
      todo.order += 1;
      return todo;
    });
  }

  async updateTodo(id: number, updateTodo: UpdateTodoDto, user: User) {
    const todo = await this.getOneTodo(id, user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    if (updateTodo.categories.length > MAX_CATEGORY_LENGTH) {
      throw new BadRequestException(
        `등록 가능한 카테고리 개수 ${MAX_CATEGORY_LENGTH}개를 초과했습니다.`,
      );
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

  async doTodo(id: number, user: User, focusTime: number) {
    const todo = await this.getOneTodo(id, user);

    if (!focusTime) {
      throw new BadRequestException('집중시간을 찾을 수 없습니다.');
    }
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    if (todo.done) {
      throw new BadRequestException('이미 완료한 todo입니다.');
    }

    const prevOrder = todo.order;

    todo.done = true;
    todo.order = null;
    todo.focusTime = focusTime;

    if (todo?.categories) {
      todo.categories.forEach(async (category) => {
        await this.rankingService.updateRank(category, user, focusTime);
      });
    }

    const doneTodo = await this.repo.save(todo);
    return { prevOrder, doneTodo };
  }

  async getList(isDone: boolean, user: User): Promise<Todo[]> {
    return await this.repo.find({
      relations: { categories: true },
      where: { done: isDone, user: { id: user.id } },
      order: { date: 'ASC', order: 'ASC' },
    });
  }

  groupByDate(todos: Todo[]) {
    const todosMap = new Map<Date, Todo[]>();
    for (const todo of todos) {
      const group = todosMap.get(todo.date) || [];
      group.push(todo);
      todosMap.set(todo.date, group);
    }
    return todosMap;
  }

  async reorderTodos(
    previousOrder: number,
    newOrder: number,
    userId: number,
  ): Promise<Todo[]> {
    let smallOrder = previousOrder,
      bigOrder = newOrder;
    if (previousOrder > newOrder) {
      smallOrder = newOrder;
      bigOrder = previousOrder;
    }

    const todosToUpdate = await this.repo
      .createQueryBuilder('todo')
      .select()
      .where('userId = :userId', { userId })
      .andWhere('todo.order >= :smallOrder', { smallOrder })
      .andWhere('todo.order <= :bigOrder', { bigOrder })
      .orderBy({ 'todo.order': 'ASC' })
      .getMany();

    const updated = this.updateOrder(todosToUpdate, previousOrder, newOrder);

    return this.repo.save(updated);
  }

  updateOrder(todos: Todo[], previousOrder: number, newOrder: number): Todo[] {
    const isPlus = previousOrder > newOrder;
    let calcTodos: Todo[];
    let idx: number;

    if (isPlus) {
      calcTodos = this.plusOrder(todos);
      idx = calcTodos.findIndex(
        (todo) => Number(todo.order) === Number(previousOrder) + 1,
      );
    } else {
      calcTodos = this.minusOrder(todos);
      idx = calcTodos.findIndex(
        (todo) => Number(todo.order) === Number(previousOrder) - 1,
      );
    }

    calcTodos[idx].order = newOrder;
    return calcTodos;
  }

  @Cron('0 0 5 * * 1')
  async removeTodos() {
    const staleTodos = await this.repo
      .createQueryBuilder('todo')
      .select('*')
      .where('todo.date < :date', { date: new Date() })
      .getRawMany();
    return await this.repo.remove(staleTodos);
  }

  async resetTodos(user: User) {
    const { id: userId } = user;
    const { affected } = await this.repo
      .createQueryBuilder()
      .delete()
      .from('todo')
      .where('user = :userId', { userId })
      .execute();

    if (affected === 0) {
      throw new NotFoundException('db delete failed');
    }
  }
}
