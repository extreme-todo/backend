import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { TimerModule } from 'src/timer/timer.module';
import { SettingModule } from 'src/setting/setting.module';
import { TodoModule } from 'src/todo/todo.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TimerModule, SettingModule],
  providers: [UserService, AuthService],
  controllers: [UserController],
  exports: [AuthService],
})
export class UserModule {}
