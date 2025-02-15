import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('offset') offset: number,
    @Query('productName') productName: string,
  ) {
    return await this.productsService.findAll(offset, productName);
  }

  @Get(':id')
  async findOne(@Param('id') id: number){
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() UpdateProductDto: UpdateProductDto,
  ) {
    await this.productsService.update(id, UpdateProductDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.productsService.delete(id);
  }
}
