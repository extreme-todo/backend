import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimerService } from 'src/timer/timer.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private timerService: TimerService,
  ) {}

  findUser(email: string) {
    return this.repo.findOne({
      where: { email: email },
    });
  }

  async createUser(userinfo: CreateUserDto) {
    const newUser = await this.repo.save(userinfo);
    await this.timerService.initTimer(newUser);
    return newUser;
  }
}
