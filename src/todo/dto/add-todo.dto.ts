import { IsBoolean, IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export type Category = 'code' | 'math' | 'english';

export class AddTodoDto {
  @IsDate()
  readonly date: Date;

  @IsString()
  readonly todo: string;

  @IsNumber()
  readonly duration: number;

  @IsBoolean()
  readonly done: boolean;

  @IsString()
  readonly category: Category;
}
