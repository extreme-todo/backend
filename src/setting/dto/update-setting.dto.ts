import { IsBoolean, IsObject, IsString } from 'class-validator';
import { ColorMode } from '../entities/setting.entity';

export class UpdateSettingDto {
  @IsString()
  colorMode: ColorMode;

  @IsBoolean()
  extremeMode: boolean;

  @IsObject()
  userinfo: object;
}
