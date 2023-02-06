import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { VerifiedMiddleware } from 'src/middlewares/verified.middleware';
import { TimerModule } from 'src/timer/timer.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TimerModule],
  providers: [UserService, AuthService],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifiedMiddleware)
      .exclude('/api/users/(.*)')
      .forRoutes('*');
  }
}
