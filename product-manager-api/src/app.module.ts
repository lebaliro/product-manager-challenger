import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { IaModule } from './ia/ia.module';

@Module({
  imports: [],
})
export class AppModule {}
