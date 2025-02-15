import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { IaModule } from './ia/ia.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { CatchFilter } from './common/filters/exception.filter';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from '@nestjs/passport';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ProductsModule, IaModule, LoggerModule, AuthModule, PrismaModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CatchFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard('X-API-KEY'),
    },
  ],
})
export class AppModule {}
