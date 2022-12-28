import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export type Category = 'code' | 'math' | 'english';

export class AddTodoDto {
  @IsDate()
  date: Date;

  @IsString()
  todo: string;

  @IsNumber()
  duration: number;

  @Transform(({ value }) => JSON.stringify(value))
  category: string;
}
