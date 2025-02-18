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
import { GetUser, Public } from 'src/auth/decorators/auth.decorators';
import { userInfo } from 'os';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: any) {
    console.log(user.id);
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  async findAll(
    @Query('offset') offset: number | undefined,
    @Query('limit') limit: number | undefined,
    @Query('productName') productName: string | undefined,
    @GetUser() user,
  ) {
    return await this.productsService.findAll(
      { offset, limit, productName },
      user,
    );
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: number) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() UpdateProductDto: UpdateProductDto,
    @GetUser() user,
  ) {
    await this.productsService.update(id, UpdateProductDto, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @GetUser() user) {
    await this.productsService.delete(id, user);
  }
}
