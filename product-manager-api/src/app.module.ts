import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { IaModule } from './ia/ia.module';
import { APP_FILTER } from '@nestjs/core';
import { CatchFilter } from './common/filters/exception.filter';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [ProductsModule, IaModule, LoggerModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchFilter,
    },

  ],
})
export class AppModule {}
