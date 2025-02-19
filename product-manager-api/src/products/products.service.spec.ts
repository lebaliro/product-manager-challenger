/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoggerGlobal } from 'src/common/logger/logger.provider';
import { IaService } from 'src/ia/ia.service';
import { CreateProductDto } from './dtos/products.dto';
import { ProductFindAllParams } from './types/products.types';
import { UserDto } from 'src/auth/dtos/auth.dto';

interface mockQuery {
  take?: number | undefined;
  skip?: number | undefined;
  where: {
    name?: {
      contains?: string | undefined;
    };
    id?: number;
    authorId?: number;
  };
}

// TODO: update tests
// it('should list with limit and offset params') Adicionar o slice na função filterMockProducts para permitir esse teste
// it('should update product')
// it('should not update if user unauthorized')
// it('should not delete if user unauthorized')

describe('ProductsService', () => {
  let productService: ProductsService;
  let prisma: PrismaService;
  let logger: LoggerGlobal;
  let iaService: IaService;
  let mockCreateProductDto: CreateProductDto;
  let mockUser: UserDto;
  let mockProducts: Array<{ id: number; name: string; authorId: number }>;

  beforeEach(async () => {
    mockCreateProductDto = {
      name: 'produt1',
    };

    mockUser = {
      id: 1,
      apikey: 'apikey',
      cpf: 'cpf',
    };

    mockProducts = [
      { id: 1, name: 'product1', authorId: 1 },
      { id: 2, name: 'product2', authorId: 2 },
      { id: 3, name: 'product3', authorId: 1 },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: IaService,
          useValue: {
            enrichProduct: jest.fn(),
            generateEmbedding: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            $executeRaw: jest.fn(),
            product: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: LoggerGlobal,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    logger = module.get<LoggerGlobal>(LoggerGlobal);
    iaService = module.get<IaService>(IaService);
    productService = await module.resolve<ProductsService>(ProductsService);
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(prisma).toBeDefined();
    expect(logger).toBeDefined();
    expect(iaService).toBeDefined();
  });

  it('should dependencies be injected', () => {
    expect(productService).toHaveProperty('prisma');
    expect(productService['prisma']).toBe(prisma);

    expect(productService).toHaveProperty('logger');
    expect(productService['logger']).toBe(logger);

    expect(productService).toHaveProperty('iaService');
    expect(productService['iaService']).toBe(iaService);
  });

  describe('create', () => {
    it('should create product', async () => {
      const mockEnrichedProduct = {
        technicalDescription: 'description',
        funcionalityDescription: ['func1', 'func2'],
        price: 151.99,
      };

      (iaService.enrichProduct as jest.Mock).mockResolvedValue({
        funcionalityDescription: mockEnrichedProduct.funcionalityDescription,
        price: mockEnrichedProduct.price,
        technicalDescription: mockEnrichedProduct.technicalDescription,
      });

      const mockContentToEmbedding = `${mockCreateProductDto.name} ${mockEnrichedProduct.technicalDescription} ${mockEnrichedProduct.funcionalityDescription.toString()}`;

      const mockEmbedding = [0.00051516, -1.515161156, 0.0621500515];
      (iaService.generateEmbedding as jest.Mock).mockResolvedValue({
        mockEmbedding,
      });

      (prisma.$executeRaw as jest.Mock).mockResolvedValue({});

      await productService.create(mockCreateProductDto, mockUser);

      expect(iaService.enrichProduct).toHaveBeenCalledWith(
        mockCreateProductDto.name,
      );
      expect(iaService.generateEmbedding).toHaveBeenCalledWith(
        mockContentToEmbedding,
      );
    });
  });
  describe('findAll', () => {
    const mockProductFindAllParams: ProductFindAllParams = {
      limit: 10,
      offset: undefined,
      productName: undefined,
    };

    const filterMockProducts = (mockQuery: mockQuery) => {
      const productsFiltered = mockProducts.filter((mockProduct) => {
        const productName = mockQuery.where.name?.contains;
        const userId = mockQuery.where.authorId;

        const isNameEqual = productName // Essa condição está estrita para simplificar o teste.
          ? mockProduct.name === productName
          : true;
        const isUserAuthorizated = mockProduct.authorId === userId;

        if (isNameEqual && isUserAuthorizated) return true;
      }); // Todo
      return productsFiltered;
    };

    it('should list all products', async () => {
      const mockQuery: mockQuery = {
        take: mockProductFindAllParams.limit,
        skip: mockProductFindAllParams.offset,
        where: {
          name: { contains: mockProductFindAllParams.productName },
          authorId: mockUser.id,
        },
      };

      const mockProductsResponse = [
        { id: 1, name: 'product1', authorId: 1 },
        { id: 3, name: 'product3', authorId: 1 },
      ];

      (prisma.product.findMany as jest.Mock).mockImplementation(() => {
        return Promise.resolve(filterMockProducts(mockQuery));
      });

      const products = await productService.findAll(
        mockProductFindAllParams,
        mockUser,
      );

      expect(products).toStrictEqual(mockProductsResponse);
      expect(prisma.product.findMany).toHaveBeenCalledWith(mockQuery);
    });

    it('should list with productName param', async () => {
      const mockQuery = {
        take: mockProductFindAllParams.limit,
        skip: mockProductFindAllParams.offset,
        where: {
          name: { contains: 'product3' },
          authorId: mockUser.id,
        },
      };

      (prisma.product.findMany as jest.Mock).mockImplementation(() => {
        return Promise.resolve(filterMockProducts(mockQuery));
      });

      mockProductFindAllParams.productName = mockQuery.where.name.contains;

      const products = await productService.findAll(
        mockProductFindAllParams,
        mockUser,
      );

      expect(products).toStrictEqual([mockProducts[2]]);
      expect(prisma.product.findMany).toHaveBeenCalledWith(mockQuery);
    });
  });
  describe('findOne', () => {
    it('should detail product', async () => {
      const mockQuery = {
        where: {
          id: mockProducts[0].id,
        },
      };

      (prisma.product.findFirst as jest.Mock).mockResolvedValue(
        mockProducts[0],
      );

      const product = await productService.findOne(mockProducts[0].id);

      expect(product).toStrictEqual(mockProducts[0]);
      expect(prisma.product.findFirst).toHaveBeenCalledWith(mockQuery);
    });
  });
  describe('delete', () => {
    it('should return', async () => {
      const mockQuery: mockQuery = {
        where: {
          id: mockProducts[1].id,
          authorId: mockUser.id,
        },
      };

      (prisma.product.findFirst as jest.Mock).mockResolvedValue(
        mockProducts[1],
      );

      await productService.delete(mockProducts[1].id, mockUser);

      expect(prisma.product.findFirst).toHaveBeenCalledWith(mockQuery);
      delete mockQuery.where.authorId;
      expect(prisma.product.delete).toHaveBeenCalledWith(mockQuery);
    });
  });
});
