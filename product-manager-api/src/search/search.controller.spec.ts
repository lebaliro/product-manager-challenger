/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchDto } from './search.dto.ts/search.dto';

describe('SearchController', () => {
  let searchController: SearchController;
  let searchService: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: {
            productVectorSearch: jest.fn(),
          },
        },
      ],
    }).compile();

    searchController = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(searchController).toBeDefined();
    expect(searchService).toBeDefined();
  });

  describe('vector', () => {
    it('should return products searched', async () => {
      const search: SearchDto = { search: 'Garrafa térmica' };

      const mockProductsReturned = [
        { id: 1, name: 'product', embedding: [1.51551, 0.505518185] },
      ];

      (searchService.productVectorSearch as jest.Mock).mockResolvedValue(
        mockProductsReturned,
      );

      const products = await searchController.vector(search);

      expect(products).toStrictEqual(mockProductsReturned);
      expect(searchService.productVectorSearch).toHaveBeenCalledWith(search);
    });
  });
});
