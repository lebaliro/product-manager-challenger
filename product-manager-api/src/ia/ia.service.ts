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
  // Melhorar a captura dos erros com try/catch a medida que
  // os erros vão aparecendo com o tempo de uso, e a medida que
  // vamos aprendendo sobre a API do gemini.
  async enrichProduct(productName: string) {
    this.logger.log('Iniciado enriquecimento do Produto por IA');

    const gemineModel = this.geminiProvider.getGenerativeModel(
      enrichProductModelConfig,
    );

    const contentGeneratedResponse = await gemineModel.generateContent(
      promptEnrichProduct(productName),
    );

    const contentGenerated = contentGeneratedResponse.response.text();
    const contentGeneratedJson: ProductEnrich = JSON.parse(contentGenerated);

    this.logger.log('Finalizado o enriquecimento do Produto por IA');

    return contentGeneratedJson;
  }

  async generateEmbedding(content: string) {
    this.logger.log('Iniciado Gerador de Embedding');

    const gemineModel = this.geminiProvider.getGenerativeModel({
      model: 'text-embedding-004',
    });

    const result = await gemineModel.embedContent(content);

    this.logger.log('Finalizado Gerador de Embedding');

    return result.embedding.values;
  }
}
