import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findUser(email: string) {
    return await this.repo.findOne({
      where: { email: email },
    });
  }

  async createUser(userinfo: CreateUserDto) {
    const newUser = this.repo.create(userinfo);
    return await this.repo.save(newUser);
  }

  async updateUser(email: string, attrs: Partial<User>) {
    const user = await this.findUser(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
}
