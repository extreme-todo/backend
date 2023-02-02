import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  todo: string;

  @IsObject()
  userinfo: Object;
}
