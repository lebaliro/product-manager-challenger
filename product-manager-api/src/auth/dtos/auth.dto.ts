import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  cpf: string;
}

export class UserSignInDto {
  @IsNotEmpty()
  @IsString()
  apikey: string;
}

export class UserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  apikey: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;
}
