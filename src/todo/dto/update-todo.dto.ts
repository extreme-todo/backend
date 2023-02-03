import { IsArray, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  todo: string;

  @IsOptional()
  @IsString({each: true})
  categories: string[];

  @IsObject()
  userinfo: Object;
}
