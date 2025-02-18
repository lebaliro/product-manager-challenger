/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { IaModule } from 'src/ia/ia.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';
import { ProductFindAllParams } from './types/products.types';

describe('ProductsController', () => {
  let productController: ProductsController;
  let productservice: ProductsService;
  let mockCreateProductDto: CreateProductDto;
  let mockUpdateProductDto: UpdateProductDto;
  let findAllParams: ProductFindAllParams;
  let mockProduct: { id: number; name: string };
  let mockUser: { id: number };

  beforeEach(async () => {
    mockCreateProductDto = {
      name: 'productName',
    };

    mockUpdateProductDto = {
      name: 'product2',
      technicalDescription: 'description',
      funcionalityDescription: ['func1', 'func2'],
      price: 556.9,
    };

    findAllParams = {
      offset: 10,
      limit: 20,
      productName: 'produtoX',
    };

    mockProduct = {
      id: 1,
      name: mockCreateProductDto.name,
    };

    mockUser = {
      id: 1,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
      imports: [IaModule, LoggerModule, PrismaModule],
    }).compile();

    productController = module.get<ProductsController>(ProductsController);
    productservice = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
    expect(productservice).toBeDefined();
  });

  it('should dependencies be injected', () => {
    expect(productController).toHaveProperty('productsService');
    expect(productController['productsService']).toBe(productservice);
  });

  describe('create', () => {
    it('should create product', async () => {
      (productservice.create as jest.Mock).mockResolvedValue(mockProduct);

      await productController.create(mockCreateProductDto, mockUser);

      expect(productservice.create).toHaveBeenCalledWith(mockCreateProductDto);
    });
  });
  describe('findAll', () => {
    it('should return all products', async () => {
      const mockListProcut = [mockProduct, mockProduct];
      (productservice.findAll as jest.Mock).mockResolvedValue(mockListProcut);

      const productList = await productController.findAll(
        findAllParams.offset,
        findAllParams.limit,
        findAllParams.productName,
      );

      expect(productList).toBe(mockListProcut);
      expect(productservice.findAll).toHaveBeenCalledWith(findAllParams);
    });
  });
  describe('findOne', () => {
    it('should return one product', async () => {
      (productservice.findOne as jest.Mock).mockResolvedValue(mockProduct);

      const productDetail = await productController.findOne(mockProduct.id);

      expect(productDetail).toBe(mockProduct);
      expect(productservice.findOne).toHaveBeenCalledWith(mockProduct.id);
    });
  });
  describe('update', () => {
    it('should update product', async () => {
      const mockProductUpdated = {
        id: mockProduct.id,
        ...mockUpdateProductDto,
      };

      (productservice.update as jest.Mock).mockResolvedValue(
        mockProductUpdated,
      );

      await productController.update(mockProduct.id, mockUpdateProductDto);

      expect(productservice.update).toHaveBeenCalledWith(
        mockProduct.id,
        mockUpdateProductDto,
      );
    });
  });
  describe('delete', () => {
    it('should delete product', async () => {
      await productController.delete(mockProduct.id);

      expect(productservice.delete).toHaveBeenCalledWith(mockProduct.id);
    });
  });
});
