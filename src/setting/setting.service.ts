import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingService {
  constructor(@InjectRepository(Setting) private repo: Repository<Setting>) {}

  async init(user: User): Promise<Setting> {
    const setting = this.repo.create();
    setting.user = user;
    return await this.repo.save(setting);
  }

  async reset(user: User): Promise<Setting> {
    const setting = await this.repo.findOne({ where: { user } });
    setting.colorMode = 'auto';
    setting.extremeMode = true;
    return await this.repo.save(setting);
  }

  async update(user: User, data: UpdateSettingDto): Promise<Setting> {
    const setting = await this.repo.findOne({ where: { user } });
    setting.colorMode = data.colorMode;
    setting.extremeMode = data.extremeMode;
    return await this.repo.save(setting);
  }
}
