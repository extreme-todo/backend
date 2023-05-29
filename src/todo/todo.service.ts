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
    const newTodo = this.repo.create({ ...addTodoDto, categories, user });

    // 새 todo의 order = 미완료 todo가 없을 경우 0, 있을 경우 제일 마지막 todo의 order값에 1을 더한다
    newTodo.order = ((await this.getList(false, user))?.pop()?.order ?? -1) + 1;
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
    todo.done = true;
    todo.focusTime = focusTime;
    if (todo?.categories) {
      todo.categories.forEach(async (category) => {
        await this.rankingService.updateRank(category, user, focusTime);
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

  // TODO: 테스트용 코드로, PR 전에 삭제 필요
  // DISCUSSION: getList, doTodo, addTodo, deleteTodo를 따로 수정하지 않아도 repo.save 이후 마지막에 이것만 돌려줘도 될 것 같습니다.
  // 장점: 오류로 인해 done=false, order=null 같은 상황이나 같은 유저에 중복 order같은 상황이 발생해도 올바른 정렬을 보장해줍니다.
  // 단점: 모든 완료하지 않은 todo에 대해 수정 작업을 진행합니다.
  async orderTodos(user: User) {
    const { id: userId } = user;
    const undoneTodos: Todo[] = await this.repo
      .createQueryBuilder()
      .select('*')
      .where('userId = :userId', { userId })
      .andWhere('done = :done', { done : false })
      .orderBy({ 'todo.order': 'ASC', 'todo.date': "ASC" })
      .getRawMany();

    console.group("\n", "\x1b[40m", "\x1b[37m", '완료되지 않은 투두 (수정 작업 전)' ,'\x1b[0m');
    console.info("* 완료되지 않은 투두를 order과 date 순으로 불러옵니다.")
    console.info("* order이 비어있거나, order이 연속적이지 않은 투두들까지 포함하여 출력됩니다.")
    console.table(undoneTodos);
    console.groupEnd()

    let orderedTodos: Todo[];
    orderedTodos = undoneTodos.map((todo: Todo, idx: number) => {
      return { ...todo, order: idx };
    });

    console.group("\n", "\x1b[40m", "\x1b[37m", '정렬 완료한 투두 (수정 작업 전)' ,'\x1b[0m');
    console.log("* 이전에 불러온 투두들이 보였던 순서대로 모든 투두에 index를 재부여합니다.")
    console.table(orderedTodos);
    console.groupEnd();

    return this.repo.save(orderedTodos);
  }
}
