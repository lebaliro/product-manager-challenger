import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './common/logger/logger.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(LoggerGlobal));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
