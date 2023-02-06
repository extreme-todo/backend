import { IsNumber, IsObject } from 'class-validator';

export class UpdateRestDto {
  @IsNumber()
  addRestTime: number;

  @IsObject()
  userinfo: object;
}
