import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

// export type Category = 'code' | 'math' | 'english';

export class AddTodoDto {
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @IsString()
  todo: string;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString({ each: true })
  categories?: string[];

  @IsObject()
  userinfo: Object;
}
