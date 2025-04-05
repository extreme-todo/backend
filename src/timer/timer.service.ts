import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { GetProgressResponse } from './dto/get-progress-response.dto';
import { TodoService } from 'src/todo/todo.service';
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  startOfHour,
  addHours,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  addMinutes,
} from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FocusedTime } from './entities/focused-time.entity';
import { RecordFocusedTimeDto } from './dto/record-focused-time.dto';
import { CategoryService } from 'src/category/category.service';
import { GetFocusedTimeDto, TimeUnit } from './dto/get-focused-time.dto';
import { FocusedTimeResponse } from './dto/focused-time-response.dto';

@Injectable()
export class TimerService {
  constructor(
    private todoService: TodoService,
    @InjectRepository(FocusedTime)
    private focusedTimeRepository: Repository<FocusedTime>,
    private categoryService: CategoryService,
  ) {}

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
      new Date(currentTime).getTime() + offset * 60000,
    );

    doneTodos.forEach((todo) => {
      const todoAsDate = new Date(
        new Date(todo.date).getTime() + offset * 60000,
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

  async recordFocusedTime(user: User, dto: RecordFocusedTimeDto) {
    const category = await this.categoryService.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const focusedTime = this.focusedTimeRepository.create({
      user,
      category,
      duration: dto.duration,
    });

    return this.focusedTimeRepository.save(focusedTime);
  }

  async getFocusedTimeByCategory(user: User, categoryId: number) {
    return await this.focusedTimeRepository
      .createQueryBuilder('focusedTime')
      .leftJoinAndSelect('focusedTime.category', 'category')
      .where('focusedTime.user.id = :userId', { userId: user.id })
      .andWhere('focusedTime.category.id = :categoryId', { categoryId: categoryId })
      .orderBy('focusedTime.createdAt', 'ASC')
      .getMany();
  }

  async getFocusedTimeByUnit(
    user: User,
    categoryId: number,
    unit: TimeUnit,
    timezoneOffset: number,
  ): Promise<FocusedTimeResponse[]> {
    const category = await this.categoryService.findById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Create a date object with the timezone offset applied
    const now = new Date();
    const adjustedNow = addMinutes(now, timezoneOffset);

    let startDate: Date;
    let endDate: Date;

    switch (unit) {
      case TimeUnit.DAY:
        // For day unit, use the current day in the user's timezone
        startDate = startOfDay(adjustedNow);
        endDate = endOfDay(adjustedNow);
        break;
      case TimeUnit.WEEK:
        // For week unit, use the current week in the user's timezone
        startDate = startOfWeek(adjustedNow, { weekStartsOn: 0 }); // 0 = Sunday
        endDate = endOfWeek(adjustedNow, { weekStartsOn: 0 });
        break;
      case TimeUnit.MONTH:
        // For month unit, use the current month in the user's timezone
        startDate = startOfMonth(adjustedNow);
        endDate = endOfMonth(adjustedNow);
        break;
      default:
        throw new BadRequestException('Invalid time unit');
    }

    // Convert back to UTC for database query
    const utcStartDate = addMinutes(startDate, -timezoneOffset);
    const utcEndDate = addMinutes(endDate, -timezoneOffset);

    const records = await this.focusedTimeRepository
      .createQueryBuilder('focusedTime')
      .leftJoinAndSelect('focusedTime.category', 'category')
      .where('focusedTime.user.id = :userId', { userId: user.id })
      .andWhere('focusedTime.category.id = :categoryId', {
          categoryId: categoryId,
      })
      .andWhere('focusedTime.createdAt >= :startDate', { startDate: utcStartDate })
      .andWhere('focusedTime.createdAt <= :endDate', { endDate: utcEndDate })
      .orderBy('focusedTime.createdAt', 'ASC')
      .getMany();

    return this.formatFocusedTimeRecords(records, unit, timezoneOffset);
  }

  private formatFocusedTimeRecords(
    records: FocusedTime[],
    unit: TimeUnit,
    timezoneOffset: number,
  ): FocusedTimeResponse[] {
    switch (unit) {
      case TimeUnit.DAY:
        return this.formatDailyRecords(records, timezoneOffset);
      case TimeUnit.WEEK:
        return this.formatWeeklyRecords(records, timezoneOffset);
      case TimeUnit.MONTH:
        return this.formatMonthlyRecords(records, timezoneOffset);
      default:
        throw new BadRequestException('Invalid time unit');
    }
  }

  private formatDailyRecords(
    records: FocusedTime[],
    timezoneOffset: number,
  ): FocusedTimeResponse[] {
    const intervals: FocusedTimeResponse[] = [];

    // Initialize all intervals with 0
    for (let i = 0; i < 12; i++) {
      const startTime = i * 2;
      intervals.push({
        start: startTime,
        end: startTime + 2,
        focused: 0,
      });
    }

    // Group records by interval
    records.forEach(record => {
      // Adjust the date by timezone offset before getting the hour
      const adjustedDate = addMinutes(record.createdAt, timezoneOffset);
      console.log(adjustedDate);
      
      const hour = adjustedDate.getUTCHours();
      const duration = record.duration;
      intervals.forEach(interval => {
          if(hour >= interval.start && hour < interval.end){
            console.log(interval.start, interval.end, hour);
            
            interval.focused += duration;
          }
      })
    });

    return intervals;
  }

  private formatWeeklyRecords(
    records: FocusedTime[],
    timezoneOffset: number,
  ): FocusedTimeResponse[] {
    const days: FocusedTimeResponse[] = [];
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    // Initialize all days with 0
    dayNames.forEach(day => {
      days.push({ day, focused: 0 });
    });

    // Group records by day
    records.forEach(record => {
      // Adjust the date by timezone offset before getting the day
      const adjustedDate = addMinutes(record.createdAt, timezoneOffset);
      const dayIndex = adjustedDate.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
      days[dayIndex].focused += record.duration;
    });

    return days;
  }

  private formatMonthlyRecords(
    records: FocusedTime[],
    timezoneOffset: number,
  ): FocusedTimeResponse[] {
    const weeks: FocusedTimeResponse[] = [];

    // Initialize all weeks with 0
    for (let i = 1; i <= 5; i++) {
      weeks.push({ week: i, focused: 0 });
    }

    // Group records by week
    records.forEach(record => {
      // Adjust the date by timezone offset before getting the week
      const adjustedDate = addMinutes(record.createdAt, timezoneOffset);
      const weekNumber = Math.ceil(adjustedDate.getUTCDate() / 7);
      if (weekNumber >= 1 && weekNumber <= 5) {
        weeks[weekNumber - 1].focused += record.duration;
      }
    });

    return weeks;
  }
}
