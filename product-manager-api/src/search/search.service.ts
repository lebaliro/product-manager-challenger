import { Injectable } from '@nestjs/common';
import { LoggerGlobal } from 'src/common/logger/logger.provider';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { IaService } from 'src/ia/ia.service';
import { SearchDto } from './search.dto.ts/search.dto';

@Injectable()
export class SearchService {
  constructor(
    private readonly iaService: IaService,
    private readonly prisma: PrismaService,
    private readonly logger: LoggerGlobal,
  ) {}
  async productVectorSearch(search: SearchDto, limit: number = 20) {
    this.logger.log('Iniciado Pesquisa Vetorial');

    const productInfo = search.search;

    const embedding = await this.iaService.generateEmbedding(productInfo);

    const products = this.prisma.$queryRaw`
      SELECT id, name, embedding <-> CAST(${embedding} AS vector) AS distance
      FROM "Product"
      ORDER BY distance
      LIMIT ${limit}
    `;

    this.logger.log('Finalizado Pesquisa Vetorial');

    return products;
  }
}
