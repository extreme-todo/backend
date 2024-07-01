import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  todo: string;

  @IsOptional()
  @IsString({ each: true })
  categories: string[] | null;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;
}
