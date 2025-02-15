import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { IaModule } from 'src/ia/ia.module';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
      imports: [IaModule],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
