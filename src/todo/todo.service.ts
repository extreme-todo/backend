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
import { Category } from 'src/category/entities/category.entity';
import { Cron } from '@nestjs/schedule';
import { TimerService } from 'src/timer/timer.service';

const MAX_CATEGORY_LENGTH = 5;

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private repo: Repository<Todo>,
    private categoryService: CategoryService,
    private rankingService: RankingService,
    private timerService: TimerService,
  ) {}

  async addTodo(addTodoDto: AddTodoDto, user: User) {
    let categories: Category[] = null;
    if (addTodoDto.categories) {
      if (addTodoDto.categories.length > MAX_CATEGORY_LENGTH) {
        throw new BadRequestException(
          `등록 가능한 카테고리 개수 ${MAX_CATEGORY_LENGTH}개를 초과했습니다.`,
        );
      }

      categories = await this.categoryService.findOrCreateCategories(
        addTodoDto.categories,
      );
    }

    let newTodoOrder = 1;

    const todos = await this.repo.find({
      where: { done: false, user: { id: user.id } },
      order: { order: 'DESC' },
    });

    if (todos.length !== 0) {
      const searchData = todos.find(
        (todo) => new Date(todo.date) <= addTodoDto.date,
      );
      let plusedTodos: Todo[];
      if (searchData === undefined) {
        plusedTodos = this.plusOrder(todos);
      } else {
        newTodoOrder = searchData.order + 1;
        plusedTodos = this.plusOrder(
          todos.slice(0, todos.length - searchData.order),
        );
      }
      plusedTodos !== undefined && (await this.repo.save(plusedTodos));
    }

    const newTodoData = {
      ...addTodoDto,
      categories,
      user,
      order: newTodoOrder,
      id: `${new Date().getTime()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
    };

    const newTodo = this.repo.create(newTodoData);

    return await this.repo.save(newTodo);
  }

  async getOneTodo(id: string, user: User) {
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
      .select()
      .where('todo.userId = :userId', { userId })
      .andWhere('todo.order > :todoOrder', { todoOrder })
      .orderBy({ 'todo.order': 'ASC' })
      .getMany();

    const updated = this.minusOrder(todos);

    return this.repo.save(updated);
  }

  /**
   * todo를 삭제하는 메소드
   * @param {number} id
   * @param {User} user
   * @returns
   */
  async deleteTodo(id: string, user: User) {
    const todo = await this.getOneTodo(id, user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return this.repo.remove(todo);
  }

  minusOrder(todos: Todo[], operand: number = 1): Todo[] {
    if (todos.length === 0) return [];
    return todos.map((todo) => {
      todo.order -= operand;
      return todo;
    });
  }

  plusOrder(todos: Todo[]): Todo[] {
    if (todos.length === 0) return;
    return todos.map((todo) => {
      todo.order += 1;
      return todo;
    });
  }

  async updateTodo(id: string, updateTodo: UpdateTodoDto, user: User) {
    const todo = await this.getOneTodo(id, user);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    if (updateTodo.categories) {
      if (updateTodo.categories.length > MAX_CATEGORY_LENGTH) {
        throw new BadRequestException(
          `등록 가능한 카테고리 개수 ${MAX_CATEGORY_LENGTH}개를 초과했습니다.`,
        );
      }
      const newCategories = await this.categoryService.findOrCreateCategories(
        updateTodo.categories,
      );
      Object.assign(todo, { ...updateTodo, categories: newCategories });
    } else {
      Object.assign(todo, updateTodo);
    }
    return this.repo.save(todo);
  }

  async doTodo(id: string, user: User, focusTime: number) {
    const todo = await this.getOneTodo(id, user);

    if (focusTime == null) {
      throw new BadRequestException('집중시간을 찾을 수 없습니다.');
    }
    if (todo == null) {
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
        await this.timerService.recordFocusedTime(user, category, focusTime);
      });
    }

    const doneTodo = await this.repo.save(todo);
    return { prevOrder, doneTodo };
  }

  async getList(isDone: boolean, user: User): Promise<Todo[]> {
    return await this.repo.find({
      where: { done: isDone, user: { id: user.id } },
      order: { date: 'ASC', order: 'ASC' },
    });
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
      idx = calcTodos.findIndex((todo) => todo.order === previousOrder + 1);
    } else {
      calcTodos = this.minusOrder(todos);
      idx = calcTodos.findIndex((todo) => todo.order === previousOrder - 1);
    }

    calcTodos[idx].order = newOrder;

    return calcTodos;
  }

  /**
   * date를 기준으로 현재 날짜 이전 todo 중 done이 false인 todo를 삭제하는 메소드
   * @param currentDate 프론트엔드에서 ISO 형식, 즉 2024-08-14T15:00:00.000Z 형태로 보내준다.
   * @param user
   * @returns
   */
  async removeDidntDo(currentDate: string, user: User) {
    const getTodos = await this.repo
      .createQueryBuilder('todo')
      .where('todo.userId = :userId', { userId: user.id })
      .orderBy({ 'todo.order': 'ASC' })
      .getMany();
    if (getTodos.length === 0) return;

    const staleTodos = getTodos.filter(
      (todo) => new Date(todo.date) < new Date(currentDate),
    );
    const staleTodoIds = new Set(staleTodos.map((todo) => todo.id));

    await this.repo.remove(staleTodos);

    const remainingUndoneTodos = getTodos.filter(
      (todo) => !staleTodoIds.has(todo.id) && !todo.done,
    );
    remainingUndoneTodos.forEach((todo, index) => {
      todo.order = index + 1;
    });

    await this.repo.save(remainingUndoneTodos);
  }

  /**
   * @param currentDate 프론트엔드에서 ISO 형식, 즉 2024-08-14T15:00:00.000Z 형태로 보내준다.
   * 날짜의 2달 전 1일 날짜를 연.월.일 형식으로 계산해 준다.
   * @returns
   */
  getPast2Months(currentDate: string) {
    const today = new Date(currentDate);
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const past2Month = String(
      (thisMonth - 2 < 0 ? thisMonth - 2 + 12 : thisMonth - 2) + 1,
    ).padStart(2, '0');
    const pastYear = thisMonth - 2 < 0 ? thisYear - 1 : thisYear;
    return `${pastYear}-${past2Month}-01`;
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

  /**
   * 2달이 지난 Todo를 제거하는 메소드
   * Cron을 적용해야 한다. Timer 도메인의 updateMonth를 참고
   * execute every 1st day of the month 5am
   * @returns
   */
  @Cron('0 0 5 1 * *')
  async removeTodosBeforeOver2Months() {
    const past2MonthDate = this.getPast2Months(new Date().toISOString());
    const staleTodos = await this.repo
      .createQueryBuilder('todo')
      .select()
      .where('todo.date < :past2Month', {
        past2Month: new Date(past2MonthDate),
      })
      .getMany();

    return await this.repo.remove(staleTodos);
  }
}
