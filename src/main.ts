import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const clientUrl = configService.get('CLIENT_URL');

  app.use(cookieParser());
  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
