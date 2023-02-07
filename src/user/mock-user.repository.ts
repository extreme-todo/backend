import { DeepPartial, FindOneOptions, SaveOptions } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { userStub } from './stub/user.stub';

export const mockUserRepo = {
  findOne(options: FindOneOptions<User>) {
    const users = userStub();
    if (options.where['email']) {
      return Promise.resolve(
        users.filter((el) => el.email === options.where['email'])[0],
      );
    }
  },
  create(entityLike: DeepPartial<User>) {
    return { ...entityLike } as User;
  },
  save(entity: User, options?: SaveOptions) {
    return Promise.resolve(entity);
  },
};
