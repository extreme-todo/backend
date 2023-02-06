import { Module, ValidationPipe } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo/entities/todo.entity';
import { SettingModule } from './setting/setting.module';
import { User } from './user/entities/user.entity';
import { Setting } from './setting/entities/setting.entity';
import { TimerModule } from './timer/timer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TotalFocusTime } from './timer/entities/total-focus-time.entity';
import { TotalRestTime } from './timer/entities/total-rest-time.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // TODO : forRootAsync에 async가 들어가는데, async가 21번째 줄에 또 들어간다. 없어도 되지 않을까?
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      // useFactory는 환경변수 정보를 포함하고 있는 configService의 인스턴스를 가진다.
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          entities: [Todo, User, Setting, Category, TotalFocusTime, TotalRestTime],
          synchronize: true,
          // url: process.env.DATABASE_URL,
          // migrationsRun: true,
          // ssl: {
          //   rejectUnauthorized: true,
          // },
        };
      },
    }),
    TodoModule,
    UserModule,
    SettingModule,
    TimerModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
