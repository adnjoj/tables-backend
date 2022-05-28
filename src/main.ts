import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import './userRequest';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(2000);
}
bootstrap();
