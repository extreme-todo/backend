import { IsNumber, IsString } from 'class-validator';

export class RecordFocusedTimeDto {
  @IsNumber()
  categoryId: number;

  @IsNumber()
  duration: number; // in minutes
} 