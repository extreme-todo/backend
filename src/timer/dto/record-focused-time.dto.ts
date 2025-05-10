import { IsNumber, IsString } from 'class-validator';

export class RecordFocusedTimeDto {
  @IsString()
  category: string;

  @IsNumber()
  duration: number; // in minutes
}
