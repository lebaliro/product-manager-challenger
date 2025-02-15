import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './common/logger/logger.provider';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(LoggerGlobal));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
