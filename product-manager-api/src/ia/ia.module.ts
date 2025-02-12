import { Module } from '@nestjs/common';
import { IaService } from './ia.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  providers: [
    IaService,
    {
      provide: 'GOOGLE_GENERATIVE_AI',
      useFactory: () =>
        new GoogleGenerativeAI(String(process.env.GEMINE_API_KEY)),
    },
  ],
  exports: [IaService],
  imports: [LoggerModule],
})
export class IaModule {}
