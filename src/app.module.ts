import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo/entities/todo.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
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
          // host: '127.0.0.1:3306',
          // host: 'andong-gyuui-MacBookPro.local',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          entities: [Todo],
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
