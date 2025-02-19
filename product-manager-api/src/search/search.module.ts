import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { IaModule } from 'src/ia/ia.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [IaModule, PrismaModule, LoggerModule],
})
export class SearchModule {}
