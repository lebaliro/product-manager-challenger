import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { IaModule } from './ia/ia.module';
import { APP_FILTER } from '@nestjs/core';
import { CatchFilter } from './common/filters/exception.filter';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { SearchService } from './search/search.service';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ProductsModule,
    IaModule,
    LoggerModule,
    AuthModule,
    PrismaModule,
    SearchModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchFilter,
    },
    SearchService,
  ],
})
export class AppModule {}
