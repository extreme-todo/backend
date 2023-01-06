import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  todo: string;
}
