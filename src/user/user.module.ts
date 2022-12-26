import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  //TODO: User 엔티티 추가
  imports: [TypeOrmModule.forFeature([])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
