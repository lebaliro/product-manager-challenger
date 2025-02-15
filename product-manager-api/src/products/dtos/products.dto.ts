import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  technicalDescription: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  funcionalityDescription: string[];

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
