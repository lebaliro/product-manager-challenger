import { Test, TestingModule } from '@nestjs/testing';
import { IaService } from './ia.service';
import { LoggerModule } from 'src/common/logger/logger.module';
import { LoggerGlobal } from 'src/common/logger/logger.provider';
import { enrichProductModelConfig } from './configs/gemini.configs';
import { promptEnrichProduct } from './consts/ia.consts';

describe('IaService', () => {
  let iaService: IaService;
  let logger: LoggerGlobal;

  const googleGenerativeAI = {
    getGenerativeModel: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IaService,
        {
          provide: 'GOOGLE_GENERATIVE_AI',
          useValue: googleGenerativeAI,
        },
      ],
      exports: [IaService],
      imports: [LoggerModule],
    }).compile();

    iaService = module.get<IaService>(IaService);
    logger = module.get<LoggerGlobal>(LoggerGlobal);
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(iaService).toBeDefined();
    expect(logger).toBeDefined();
    expect(googleGenerativeAI).toBeDefined();
  });

  it('should dependencies be injected', () => {
    expect(iaService).toHaveProperty('geminiProvider');
    expect(iaService['geminiProvider']).toBe(googleGenerativeAI);

    expect(iaService).toHaveProperty('logger');
    expect(iaService['logger']).toBe(logger);
  });

  describe('enrichProduct', () => {
    it('should return enriched product', async () => {
      const productName = 'test';

      const mockGenerateContent = jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('Enriched Product Description'),
        },
      });

      googleGenerativeAI.getGenerativeModel.mockImplementation(() => ({
        generateContent: mockGenerateContent,
      }));

      const result = await iaService.enrichProduct(productName);

      expect(googleGenerativeAI.getGenerativeModel).toHaveBeenCalledWith(
        enrichProductModelConfig,
      );
      expect(mockGenerateContent).toHaveBeenCalledWith(
        promptEnrichProduct('test'),
      );
      expect(result).toBe('Enriched Product Description');
    });
  });

  describe('generateEmbedding', () => {
    it('should return embedding values', async () => {
      const content = 'Text to be embedded';
      const embeddedValue = [51, 50, 64];
      const mockEmbeddedContent = jest.fn().mockResolvedValue({
        embedding: { values: embeddedValue },
      });

      googleGenerativeAI.getGenerativeModel.mockImplementation(() => ({
        embedContent: mockEmbeddedContent,
      }));

      const result = await iaService.generateEmbedding(content);

      expect(googleGenerativeAI.getGenerativeModel).toHaveBeenCalledWith({
        model: 'text-embedding-004',
      });
      expect(mockEmbeddedContent).toHaveBeenCalledWith(content);
      expect(result).toStrictEqual(embeddedValue);
    });
  });
});
