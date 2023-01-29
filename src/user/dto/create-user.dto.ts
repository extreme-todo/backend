import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  refresh: string;
}
