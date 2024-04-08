import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingService } from './setting.service';

@Controller('api/settings')
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  getSetting(@CurrentUser() user: User) {
    return this.settingService.find(user);
  }

  @Put('/')
  @UseGuards(AuthGuard)
  udpateSetting(@CurrentUser() user: User, @Body() data: UpdateSettingDto) {
    return this.settingService.update(user, data);
  }
}
