import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { GetProgressResponse } from './dto/get-progress-response.dto';
import { TodoService } from 'src/todo/todo.service';
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
} from 'date-fns';

@Injectable()
export class TimerService {
  constructor(private todoService: TodoService) {}

  async getProgress(user: User, currentTime: string, offset: number) {
    const doneTodos = await this.todoService.getList(true, user);

    const focusTime = {
      today: 0,
      yesterday: 0,
      thisWeek: 0,
      lastWeek: 0,
      thisMonth: 0,
      lastMonth: 0,
    };

    const currentAsDate = new Date(
      new Date(currentTime).getTime() - offset * 60000,
    );

    doneTodos.forEach((todo) => {
      const todoAsDate = new Date(
        new Date(todo.date).getTime() - offset * 60000,
      );

      if (currentAsDate >= todoAsDate) {
        const [diffDays, diffWeeks, diffMonths] = [
          differenceInCalendarDays(currentAsDate, todoAsDate),
          differenceInCalendarWeeks(currentAsDate, todoAsDate, {
            weekStartsOn: 1,
          }),
          differenceInCalendarMonths(currentAsDate, todoAsDate),
        ];
        if (diffDays === 0) {
          focusTime.today += todo.focusTime;
        }
        if (diffMonths === 0) {
          focusTime.thisMonth += todo.focusTime;
        }
        if (diffWeeks === 0) {
          focusTime.thisWeek += todo.focusTime;
        }
        if (diffDays === 1) {
          focusTime.yesterday += todo.focusTime;
        }
        if (diffMonths === 1) {
          focusTime.lastMonth += todo.focusTime;
        }
        if (diffWeeks === 1) {
          focusTime.lastWeek += todo.focusTime;
        }
      }
    });

    return {
      daily: focusTime.today - focusTime.yesterday,
      weekly: focusTime.thisWeek - focusTime.lastWeek,
      monthly: focusTime.thisMonth - focusTime.lastMonth,
    } as GetProgressResponse;
  }
}
