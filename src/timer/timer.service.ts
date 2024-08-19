import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { GetProgressResponse } from './dto/get-progress-response.dto';
import { TodoService } from 'src/todo/todo.service';

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

    const [currentYear, currentMonth, currentDate] = [
      currentAsDate.getFullYear(),
      currentAsDate.getMonth(),
      currentAsDate.getDate(),
    ];

    doneTodos.forEach((todo) => {
      const todoAsDate = new Date(
        new Date(todo.date).getTime() - offset * 60000,
      );
      const [todoYear, todoMonth, todoDate] = [
        todoAsDate.getFullYear(),
        todoAsDate.getMonth(),
        todoAsDate.getDate(),
      ];
      const timeDiff = currentAsDate.getTime() - todoAsDate.getTime();

      if (todoYear === currentYear) {
        if (todoMonth === currentMonth) {
          if (todoDate === currentDate) focusTime.today += todo.focusTime;
          if (todoDate === currentDate - 1)
            focusTime.yesterday += todo.focusTime;
          focusTime.thisMonth += todo.focusTime;
        }
        if (todoMonth === currentMonth - 1)
          focusTime.lastMonth += todo.focusTime;
        if (timeDiff < 1000 * 60 * 60 * 24 * 7) {
          focusTime.thisWeek += todo.focusTime;
        } else if (timeDiff < 1000 * 60 * 60 * 24 * 7 * 2) {
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
