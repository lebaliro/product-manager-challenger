import { Inject, Injectable } from '@nestjs/common';
import { enrichProductModelConfig } from './common/configs/gemini.configs';
import { LoggerGlobal } from 'src/common/logger/logger.provider';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promptEnrichProduct } from './common/consts/ia.consts';

@Injectable()
export class IaService {
  constructor(
    @Inject('GOOGLE_GENERATIVE_AI')
    private readonly geminiProvider: GoogleGenerativeAI,
    private readonly logger: LoggerGlobal,
  ) {}

  async enrichProduct(productName: string): Promise<string> {
    this.logger.log('Iniciado enriquecimento do Produto');

    const gemineModel = this.geminiProvider.getGenerativeModel(
      enrichProductModelConfig,
    );

    const result = await gemineModel.generateContent(
      promptEnrichProduct(productName),
    );

    this.logger.log('Finalizado o enriquecimento do Produto');

    return result.response.text();
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
