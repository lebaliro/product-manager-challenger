/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoggerGlobal } from 'src/common/logger/logger.provider';
import { IaService } from 'src/ia/ia.service';
import { CreateProductDto } from './dtos/products.dto';
import { ProductFindAllParams } from './types/products.types';

describe('ProductsService', () => {
  let productService: ProductsService;
  let prisma: PrismaService;
  let logger: LoggerGlobal;
  let iaService: IaService;
  let mockCreateProductDto: CreateProductDto;
  let mockUser: { id: number; apikey: string };

  beforeEach(async () => {
    mockCreateProductDto = {
      name: 'produt1',
    };

    mockUser = {
      id: 1,
      apikey: 'apikey',
    };

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
    // Mocks to all tests
    const mockProducts = [
      { id: 1, name: 'product1' },
      { id: 2, name: 'product2' },
      { id: 3, name: 'product3' },
    ];

    let mockProductFindAllParams: ProductFindAllParams = {
      limit: undefined,
      offset: undefined,
      productName: undefined,
    };

    it('should list all products', async () => {
      const mockQuery = {
        take: mockProductFindAllParams.limit,
        skip: mockProductFindAllParams.offset,
        where: {
          name: { contains: mockProductFindAllParams.productName },
        },
      };

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const products = await productService.findAll(
        mockProductFindAllParams,
        mockUser,
      );

      expect(products).toBe(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith(mockQuery);
    });

    it('should list with producName param', async () => {
      mockProductFindAllParams = {
        limit: undefined,
        offset: undefined,
        productName: 'product3',
      };

      const mockQuery = {
        take: mockProductFindAllParams.limit,
        skip: mockProductFindAllParams.offset,
        where: {
          name: { contains: mockProductFindAllParams.productName },
        },
      };

      (prisma.product.findMany as jest.Mock).mockImplementation(
        (mockQuery: { where: { name: { contains: string } } }) => {
          return Promise.resolve(
            mockProducts.filter(
              (product) => product.name == mockQuery.where.name.contains,
            ),
          );
        },
      );

      const products = await productService.findAll(
        mockProductFindAllParams,
        mockUser,
      );

      expect(products).toStrictEqual([mockProducts[2]]);
      expect(prisma.product.findMany).toHaveBeenCalledWith(mockQuery);
    });
    // it('should list with offset and limit param', async () => {
    //   mockProductFindAllParams = {
    //     limit: 1,
    //     offset: 0,
    //     productName: undefined,
    //   };

    //   const mockQuery = {
    //     take: mockProductFindAllParams.limit,
    //     skip: mockProductFindAllParams.offset,
    //     where: {
    //       name: { contains: mockProductFindAllParams.productName },
    //     },
    //   };

    //   (prisma.product.findMany as jest.Mock).mockImplementation(
    //     (mockQuery: { take: number; skip: number }) => {
    //       return Promise.resolve(
    //         mockProducts.filter(
    //           (product) => product[mockQuery.skip] ==,
    //         ),
    //       );
    //     },
    //   );

    //   const products = await productService.findAll(
    //     mockProductFindAllParams,
    //     mockUser,
    //   );

    //   expect(products).toStrictEqual([mockProducts[2]]);
    //   expect(prisma.product.findMany).toHaveBeenCalledWith(mockQuery);
    // });
    // it('should list with all params', async () => {
    //   mockProductFindAllParams = {
    //     limit: undefined,
    //     offset: undefined,
    //     productName: 'product3',
    //   };

    //   const mockQuery = {
    //     take: mockProductFindAllParams.limit,
    //     skip: mockProductFindAllParams.offset,
    //     where: {
    //       name: { contains: mockProductFindAllParams.productName },
    //     },
    //   };

    //   (prisma.product.findMany as jest.Mock).mockImplementation(
    //     (mockQuery: { where: { name: { contains: string } } }) => {
    //       return Promise.resolve(
    //         mockProducts.filter(
    //           (product) => product.name == mockQuery.where.name.contains,
    //         ),
    //       );
    //     },
    //   );

    //   const products = await productService.findAll(
    //     mockProductFindAllParams,
    //     mockUser,
    //   );

    //   expect(products).toStrictEqual([mockProducts[2]]);
    //   expect(prisma.product.findMany).toHaveBeenCalledWith(mockQuery);
    // });
    it('should not list with param if offset or limit undefined ', async () => {
      mockProductFindAllParams = {
        limit: undefined,
        offset: 10,
        productName: undefined,
      };

      const mockQuery = {
        take: mockProductFindAllParams.limit,
        skip: undefined,
        where: {
          name: { contains: mockProductFindAllParams.productName },
        },
      };

      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const products = await productService.findAll(
        mockProductFindAllParams,
        mockUser,
      );

      expect(products).toStrictEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalledWith(mockQuery);
    });
  });
});
