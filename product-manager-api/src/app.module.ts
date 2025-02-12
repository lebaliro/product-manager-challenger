import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CatchFilter } from './common/filters/exception.filter';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchFilter,
    },
  ],
})
export class AppModule {}
