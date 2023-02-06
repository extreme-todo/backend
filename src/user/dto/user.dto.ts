import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  todo: string;

  @Expose()
  totalFocusTime: string;

  @Expose()
  totalRestTime: string;

  @Expose()
  setting: string;
}
