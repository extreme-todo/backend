import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsObject, IsString } from 'class-validator';

export type Category = 'code' | 'math' | 'english';

export class AddTodoDto {
  @IsDate()
  @Transform(({value}) => new Date(value))
  date: Date;

  @IsString()
  todo: string;

  @IsNumber()
  duration: number;

  @Transform(({ value }) => JSON.stringify(value))
  category: string;

  @IsObject()
  userinfo: Object;
}
