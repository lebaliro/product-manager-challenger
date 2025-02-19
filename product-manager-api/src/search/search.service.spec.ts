/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { IaService } from 'src/ia/ia.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoggerGlobal } from 'src/common/logger/logger.provider';
import { Search } from '@nestjs/common';

describe('SearchService', () => {
  let searchService: SearchService;
  let iaService: IaService;
  let prisma: PrismaService;
  let logger: LoggerGlobal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: IaService,
          useValue: {
            generateEmbedding: jest.fn(),
          },
        },
        {
          provide: LoggerGlobal,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    searchService = module.get<SearchService>(SearchService);
    iaService = module.get<IaService>(IaService);
    prisma = module.get<PrismaService>(PrismaService);
    logger = module.get<LoggerGlobal>(LoggerGlobal);
  });

  it('should be defined', () => {
    expect(searchService).toBeDefined();
  });

  it('should dependencies be injected', () => {
    expect(searchService).toHaveProperty('iaService');
    expect(searchService['iaService']).toBe(iaService);

    expect(searchService).toHaveProperty('prisma');
    expect(searchService['prisma']).toBe(prisma);

    expect(searchService).toHaveProperty('logger');
    expect(searchService['logger']).toBe(logger);
  });

  describe('vectorSearch', () => {
    it('should return products', async () => {
      const productInfo = { search: 'Couro' };
      const limit = 3;

      const embedding = [-0.515561, 0.0005818, 1.0215151];
      const mockProductsReturned = [
        { id: 8, name: 'carteira de couro', distance: 1.0259153349634875 },
        { id: 4, name: 'garrafa termica', distance: 1.1280516455305274 },
        { id: 7, name: 'garrafa termica', distance: 1.1382403594810448 },
      ];
      const mockQuery = [
        `
          SELECT id, name, embedding <-> CAST(", " AS vector) AS distance
          FROM \"Product\"
          ORDER BY distance
          LIMIT ", "
    `,
        [-0.515561, 0.0005818, 1.0215151],
        limit,
      ];

      (iaService.generateEmbedding as jest.Mock).mockResolvedValue(embedding);

      (prisma.$queryRaw as jest.Mock).mockReturnValue(mockProductsReturned);

      const products = await searchService.productVectorSearch(
        productInfo,
        limit,
      );

      expect(products).toStrictEqual(mockProductsReturned);
      expect(iaService.generateEmbedding).toHaveBeenCalledWith(
        productInfo.search,
      );
      // expect(prisma.$queryRaw).toHaveBeenCalledWith(mockQuery);
    });
  });
});
