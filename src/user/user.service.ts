import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findUser(email: string) {
    return this.repo.findOne({
      where: { email: email },
    });
  }

  createUser(userinfo: CreateUserDto) {
    const newUser = this.repo.create(userinfo);
    return this.repo.save(newUser);
  }
}
