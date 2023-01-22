import { Body, Controller, Get, Patch } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingService } from './setting.service';

@Controller('setting')
export class SettingController {
  constructor(private settingService: SettingService) {}
  // TODO: AuthGuard 등으로 가져온 유저를 사용할 예정
  @Get('/')
  getSetting() {
    const fakeUser = { email: 'asd@asd.asd', username: 'asd', id: 1 } as User;
    return this.settingService.find(fakeUser);
  }

  // TODO: AuthGuard 등으로 가져온 유저를 사용할 예정
  @Patch('/')
  udpateSetting(@Body() data: UpdateSettingDto) {
    const fakeUser = { email: 'asd@asd.asd', username: 'asd', id: 1 } as User;
    return this.settingService.update(fakeUser, data);
  }
}
