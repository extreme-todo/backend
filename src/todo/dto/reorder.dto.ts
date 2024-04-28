import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ReorderDto {
  @IsNumber()
  @Type(() => Number)
  prevOrder: number;

  @IsNumber()
  @Type(() => Number)
  newOrder: number;
}
