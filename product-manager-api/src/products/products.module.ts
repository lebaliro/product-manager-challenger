import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { IaModule } from 'src/ia/ia.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [IaModule, PrismaModule, LoggerModule],
})
export class ProductsModule {}
