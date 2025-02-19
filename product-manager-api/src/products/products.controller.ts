import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';
import { GetUser, Public } from 'src/auth/decorators/auth.decorators';
import { UserDto } from 'src/auth/dtos/auth.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: UserDto) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  async findAll(
    @Query('offset') offset: number | undefined,
    @Query('limit') limit: number | undefined,
    @Query('productName') productName: string | undefined,
    @GetUser() user: UserDto,
  ) {
    return await this.productsService.findAll(
      { offset, limit, productName },
      user,
    );
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateProductDto: UpdateProductDto,
    @GetUser() user: UserDto,
  ) {
    await this.productsService.update(id, UpdateProductDto, user);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserDto,
  ) {
    await this.productsService.delete(id, user);
  }
}
