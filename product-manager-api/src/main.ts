import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './common/logger/logger.provider';
import { ValidationPipe } from '@nestjs/common';
import { ApiKeyAuthGuard } from './auth/guards/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new ApiKeyAuthGuard(reflector));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(LoggerGlobal));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
