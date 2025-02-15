import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dtos/products.dto';
import { IaService } from 'src/ia/ia.service';
import { LoggerGlobal } from 'src/common/logger/logger.provider';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly iaService: IaService,
    private readonly logger: LoggerGlobal,
  ) {}

  private contentToEmbedding(
    name: string,
    funcionalityDescription: string[],
    technicalDescription: string,
  ): string {
    return `${name} ${technicalDescription} ${funcionalityDescription.toString()}`;
  }

  private async productExistValidator(name: string) {
    const productExists = await this.prisma.product.findFirst({
      where: {
        name,
      },
    });

    if (productExists) {
      throw new ConflictException('Você já criou um produto com esse nome.');
    }
  }

  async create(createProductDto: CreateProductDto) {
    this.logger.log('Iniciado Criação do Produto');

    const name = createProductDto.name.toLocaleLowerCase().trim();

    await this.productExistValidator(name);

    const { funcionalityDescription, price, technicalDescription } =
      await this.iaService.enrichProduct(name);

    const contentToEmbedding = this.contentToEmbedding(
      name,
      funcionalityDescription,
      technicalDescription,
    );

    const embedding =
      await this.iaService.generateEmbedding(contentToEmbedding);

    await this.prisma.$executeRawUnsafe(
      `
        INSERT INTO "Product" (
          "name",
          "technicalDescription",
          "functionalities",
          "price",
          "embedding",
          "createdAt",
          "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      `,
      name,
      technicalDescription,
      funcionalityDescription,
      price,
      embedding,
    );

    this.logger.log('Finalizado Criação do Produto');
  }

  async findAll(offset: number | undefined, productName: string) {
    this.logger.log('Iniciado Listagem do Produto');

    offset = offset ? Number(offset) : undefined;

    const products = this.prisma.product.findMany({
      take: 10,
      skip: offset,
      where: {
        name: { contains: productName },
      },
    });

    this.logger.log('Finalizado Listagem do Produto');

    return products;
  }

  async findOne(id: number) {
    this.logger.log('Iniciado Detalhamento do Produto');

    id = Number(id);

    const product = this.prisma.product.findFirst({
      where: {
        id,
      },
    });

    this.logger.log('Finalizado Detalhamento do Produto');

    return product;
  }

  async update(id: number, UpdateProductDto: UpdateProductDto) {
    this.logger.log('Iniciado Atualização do Produto');

    id = Number(id);
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

  async delete(id: number) {
    this.logger.log('Iniciado Deletar o Produto');

    id = Number(id);

    await this.prisma.product.delete({
      where: {
        id,
      },
    });

    this.logger.log('Finalizado Deletar o Produto');
  }
}
