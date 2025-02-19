import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';
import { IaService } from 'src/ia/ia.service';
import { LoggerGlobal } from 'src/common/logger/logger.provider';
import { ProductFindAllParams } from './types/products.types';
import { REQUEST } from '@nestjs/core';
import { UserDto } from 'src/auth/dtos/auth.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly iaService: IaService,
    private readonly logger: LoggerGlobal,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private contentToEmbedding(
    name: string,
    funcionalityDescription: string[],
    technicalDescription: string,
  ): string {
    return `${name} ${technicalDescription} ${funcionalityDescription.toString()}`;
  }

  async create(createProductDto: CreateProductDto, user: UserDto) {
    this.logger.log('Iniciado Criação do Produto');

    const name = createProductDto.name.toLocaleLowerCase().trim();

    const { funcionalityDescription, price, technicalDescription } =
      await this.iaService.enrichProduct(name);

    const contentToEmbedding = this.contentToEmbedding(
      name,
      funcionalityDescription,
      technicalDescription,
    );

    const embedding =
      await this.iaService.generateEmbedding(contentToEmbedding);

    await this.prisma.$executeRaw`
        INSERT INTO "Product" (
          "name",
          "technicalDescription",
          "functionalities",
          "price",
          "embedding",
          "authorId",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          ${name}, 
          ${technicalDescription}, 
          ${funcionalityDescription}, 
          ${price}, 
          ${embedding},
          ${user.id},
          NOW(), 
          NOW()
        )
      `;

    this.logger.log('Finalizado Criação do Produto');
  }

  async findAll(params: ProductFindAllParams, user: UserDto) {
    this.logger.log('Iniciado Listagem do Produto');
    const { offset, limit, productName } = params;

    const take = limit ? limit : 10;

    const products = this.prisma.product.findMany({
      take,
      skip: offset,
      where: {
        name: { contains: productName },
        authorId: user.id,
      },
    });

    this.logger.log('Finalizado Listagem do Produto');

    return products;
  }

  async findOne(id: number) {
    this.logger.log('Iniciado Detalhamento do Produto');

    const product = this.prisma.product.findFirst({
      where: {
        id,
      },
    });

    this.logger.log('Finalizado Detalhamento do Produto');

    return product;
  }

  private async isAuthorizated(id: number, userId: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: id,
        authorId: userId,
      },
    });

    if (!product) {
      throw new HttpException('Acesso negado', HttpStatus.UNAUTHORIZED);
    }
  }

  async update(id: number, UpdateProductDto: UpdateProductDto, user: UserDto) {
    this.logger.log('Iniciado Atualização do Produto');

    await this.isAuthorizated(id, user.id);

    const { name, technicalDescription, funcionalityDescription, price } =
      UpdateProductDto;

    const contentToEmbedding = this.contentToEmbedding(
      name,
      funcionalityDescription,
      technicalDescription,
    );

    const embedding =
      await this.iaService.generateEmbedding(contentToEmbedding);

    await this.prisma.$executeRawUnsafe(
      `UPDATE "Product"
      SET name = $1, "technicalDescription" = $2, functionalities = $3, price = $4, embedding = $5
      WHERE id=$6`,
      name,
      technicalDescription,
      funcionalityDescription,
      price,
      embedding,
      id,
    );

    this.logger.log('Iniciado Atualização do Produto');
  }

  async delete(id: number, user: UserDto) {
    this.logger.log('Iniciado Deletar o Produto');

    await this.isAuthorizated(id, user.id);

    await this.prisma.product.delete({
      where: {
        id,
      },
    });

    this.logger.log('Finalizado Deletar o Produto');
  }
}
