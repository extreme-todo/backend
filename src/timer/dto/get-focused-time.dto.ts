import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export enum TimeUnit {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class GetFocusedTimeDto {
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsEnum(TimeUnit)
  unit: TimeUnit;

  @IsNotEmpty()
  @IsNumber()
  timezoneOffset: number;
} 