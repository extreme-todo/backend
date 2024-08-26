import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingService } from 'src/setting/setting.service';
import { TimerService } from 'src/timer/timer.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private settingService: SettingService,
  ) {}

  async findUser(email: string) {
    return await this.repo.findOne({
      where: { email: email },
    });
  }

  async createUser(userinfo: CreateUserDto) {
    const newUser = this.repo.create(userinfo);
    await this.repo.save(newUser);
    await this.settingService.init(newUser);
    return newUser;
  }

  async updateUser(email: string, attrs: Partial<User>) {
    const user = await this.findUser(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async removeUser(user: User) {
    await this.repo.remove(user);
  }
}
