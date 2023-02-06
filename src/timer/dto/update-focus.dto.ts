import { IsNumber, IsObject } from 'class-validator';

export class UpdateFocusDto {
  @IsNumber()
  addFocusTime: number;

  @IsObject()
  userinfo: object;
}
