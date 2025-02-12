import { Module } from '@nestjs/common';
import { LoggerGlobal } from './logger.provider';

@Module({
  providers: [LoggerGlobal],
  exports: [LoggerGlobal],
})
export class LoggerModule {}
