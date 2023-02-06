import { IsNumber } from 'class-validator';

export class GetProgressResponse {
  @IsNumber()
  daily: number;

  @IsNumber()
  weekly: number;

  @IsNumber()
  monthly: number;
}
