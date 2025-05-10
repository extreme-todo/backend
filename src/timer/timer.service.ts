import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  addMinutes,
  addDays,
  addWeeks,
  addMonths,
} from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FocusedTime } from './entities/focused-time.entity';
import { CategoryService } from 'src/category/category.service';
import { TimeUnit } from './dto/get-focused-time.dto';
import {
  FocusedTimeResponse,
  FocusedTimeTotalResponse,
} from './dto/focused-time-response.dto';
import { Cron } from '@nestjs/schedule';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class TimerService {
  private readonly logger = new Logger(TimerService.name);

  constructor(
    @InjectRepository(FocusedTime)
    private focusedTimeRepository: Repository<FocusedTime>,
    private categoryService: CategoryService,
  ) {}

  async recordFocusedTime(
    user: User,
    focusedCategory: Category,
    duration: number,
  ) {
    if (!focusedCategory) {
      throw new NotFoundException('Category not found');
    }
 
    const focusedTime = this.focusedTimeRepository.create({
      user,
      category: focusedCategory,
      duration: duration,
    });

    return this.focusedTimeRepository.save(focusedTime);
  }

  async getFocusedTimeByUnit(
    user: User,
    unit: TimeUnit,
    timezoneOffset: number,
    categoryId?: number,
  ): Promise<FocusedTimeTotalResponse> {
    const category = categoryId
      ? await this.categoryService.findById(categoryId)
      : null;
    if (categoryId && !category) {
      throw new NotFoundException('Category not found');
    }

    const now = new Date();
    // 현재시각을 timezoneOffset 만큼 조정
    const adjustedNow = addMinutes(now, timezoneOffset);

    let startDate: Date;
    let endDate: Date;
    let prevStartDate: Date;
    let prevEndDate: Date;

    switch (unit) {
      case TimeUnit.DAY:
        startDate = startOfDay(adjustedNow);
        endDate = endOfDay(adjustedNow);
        prevStartDate = startOfDay(addDays(startDate, -1));
        prevEndDate = endOfDay(addDays(startDate, -1));
        break;
      case TimeUnit.WEEK:
        // 현재주를 timezoneOffset 만큼 조정
        startDate = startOfWeek(adjustedNow, { weekStartsOn: 0 }); // 0 = Sunday
        endDate = endOfWeek(adjustedNow, { weekStartsOn: 0 });
        prevStartDate = startOfWeek(addWeeks(startDate, -1), {
          weekStartsOn: 0,
        });
        prevEndDate = endOfWeek(addWeeks(startDate, -1), { weekStartsOn: 0 });
        break;
      case TimeUnit.MONTH:
        // 현재달을 timezoneOffset 만큼 조정
        startDate = startOfMonth(adjustedNow);
        endDate = endOfMonth(adjustedNow);
        prevStartDate = startOfMonth(addMonths(startDate, -1));
        prevEndDate = endOfMonth(addMonths(startDate, -1));
        break;
      default:
        throw new BadRequestException('Invalid time unit');
    }

    // timezoneOffset 만큼 조정된 시각을 UTC로 변환
    const utcStartDate = addMinutes(startDate, -timezoneOffset);
    const utcEndDate = addMinutes(endDate, -timezoneOffset);
    const utcPrevStartDate = addMinutes(prevStartDate, -timezoneOffset);
    const utcPrevEndDate = addMinutes(prevEndDate, -timezoneOffset);

    const getFocusedTimeRecords = async (start: Date, end: Date) => {
      if (category) {
        return await this.focusedTimeRepository
          .createQueryBuilder('focusedTime')
          .leftJoinAndSelect('focusedTime.category', 'category')
          .where('focusedTime.user.id = :userId', { userId: user.id })
          .andWhere('focusedTime.category.id = :categoryId', {
            categoryId: category.id,
          })
          .andWhere('focusedTime.createdAt >= :startDate', { startDate: start })
          .andWhere('focusedTime.createdAt <= :endDate', { endDate: end })
          .orderBy('focusedTime.createdAt', 'ASC')
          .getMany();
      }
      return await this.focusedTimeRepository
        .createQueryBuilder('focusedTime')
        .where('focusedTime.user.id = :userId', { userId: user.id })
        .andWhere('focusedTime.createdAt >= :startDate', { startDate: start })
        .andWhere('focusedTime.createdAt <= :endDate', { endDate: end })
        .orderBy('focusedTime.createdAt', 'ASC')
        .getMany();
    };

    const records = await getFocusedTimeRecords(utcStartDate, utcEndDate);

    console.log(records);

    const prevRecords = await getFocusedTimeRecords(
      utcPrevStartDate,
      utcPrevEndDate,
    );

    // Calculate total focused time
    const totalFocusedTime = records.reduce(
      (sum, record) => sum + record.duration,
      0,
    );
    const prevFocusedTime = prevRecords.reduce(
      (sum, record) => sum + record.duration,
      0,
    );

    // Format the start and end dates with timezone offset
    const formattedStartDate = format(
      addMinutes(startDate, timezoneOffset),
      "yyyy-MM-dd'T'HH:mm:ssxxx",
    );
    const formattedEndDate = format(
      addMinutes(endDate, timezoneOffset),
      "yyyy-MM-dd'T'HH:mm:ssxxx",
    );

    // Get the interval values
    const values = this.formatFocusedTimeRecords(records, unit, timezoneOffset);

    return {
      total: {
        start: formattedStartDate,
        end: formattedEndDate,
        focused: totalFocusedTime,
        prevFocused: prevFocusedTime,
      },
      values,
    };
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

    // 모든 구간의 집중 시간을 0으로 초기화
    for (let i = 0; i < 12; i++) {
      const startTime = i * 2;
      intervals.push({
        start: startTime,
        end: startTime + 2,
        focused: 0,
      });
    }

    // 각 구간별 집중 시간 계산
    records.forEach((record) => {
      // timezoneOffset 만큼 조정된 시각을 UTC로 변환
      const adjustedDate = addMinutes(record.createdAt, timezoneOffset);

      const hour = adjustedDate.getUTCHours();
      const duration = record.duration;
      intervals.forEach((interval) => {
        if (hour >= interval.start && hour < interval.end) {
          interval.focused += duration;
        }
      });
    });

    return intervals;
  }

  private formatWeeklyRecords(
    records: FocusedTime[],
    timezoneOffset: number,
  ): FocusedTimeResponse[] {
    const days: FocusedTimeResponse[] = [];
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    // 모든 요일의 집중 시간을 0으로 초기화
    dayNames.forEach((day) => {
      days.push({ day, focused: 0 });
    });

    // 각 요일별 집중 시간 계산
    records.forEach((record) => {
      // timezoneOffset 만큼 조정된 시각을 UTC로 변환
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

    // 모든 주의 집중 시간을 0으로 초기화
    for (let i = 1; i <= 5; i++) {
      weeks.push({ week: i, focused: 0 });
    }

    // 각 주별 집중 시간 계산
    records.forEach((record) => {
      // timezoneOffset 만큼 조정된 시각을 UTC로 변환
      const adjustedDate = addMinutes(record.createdAt, timezoneOffset);
      const weekNumber = Math.ceil(adjustedDate.getUTCDate() / 7);
      if (weekNumber >= 1 && weekNumber <= 5) {
        weeks[weekNumber - 1].focused += record.duration;
      }
    });

    return weeks;
  }

  private async deleteOldFocusedTime() {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const result = await this.focusedTimeRepository
      .createQueryBuilder()
      .delete()
      .from(FocusedTime)
      .where('createdAt < :threeMonthsAgo', { threeMonthsAgo })
      .execute();

    return result;
  }

  @Cron('0 5 * * *', {
    timeZone: 'Asia/Seoul', // KST timezone
  })
  async handleDeleteOldFocusedTime() {
    this.logger.log('Running scheduled task: deleteOldFocusedTime');
    try {
      const result = await this.deleteOldFocusedTime();
      this.logger.log(
        `Successfully deleted ${result.affected} old focusedTime`,
      );
    } catch (error) {
      this.logger.error('Failed to delete old focusedTime', error.stack);
    }
  }
}
