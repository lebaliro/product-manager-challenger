import { Inject, Injectable } from '@nestjs/common';
import { enrichProductModelConfig } from './configs/gemini.configs';
import { LoggerGlobal } from 'src/common/logger/logger.provider';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promptEnrichProduct } from './consts/ia.consts';
import { ProductEnrich } from './interfaces/ia.interfaces';

@Injectable()
export class IaService {
  constructor(
    @Inject('GOOGLE_GENERATIVE_AI')
    private readonly geminiProvider: GoogleGenerativeAI,
    private readonly logger: LoggerGlobal,
  ) {}

  async enrichProduct(productName: string) {
    this.logger.log('Iniciado enriquecimento do Produto por IA');

    const gemineModel = this.geminiProvider.getGenerativeModel(
      enrichProductModelConfig,
    );

    const contentGenerated = await gemineModel.generateContent(
      promptEnrichProduct(productName),
    );

    const contentGeneratedString = contentGenerated.response.text();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const contentGeneratedJson: ProductEnrich = JSON.parse(
      contentGeneratedString,
    );

    this.logger.log('Finalizado o enriquecimento do Produto por IA');

    return contentGeneratedJson;
  }

  async generateEmbedding(content: string): Promise<number[]> {
    this.logger.log('Iniciado Gerador de Embedding');

    const gemineModel = this.geminiProvider.getGenerativeModel({
      model: 'text-embedding-004',
    });

    const result = await gemineModel.embedContent(content);

    this.logger.log('Finalizado Gerador de Embedding');

    return result.embedding.values;
  }
}
