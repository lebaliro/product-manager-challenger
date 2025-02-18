import { IsNotEmpty, IsString } from 'class-validator';

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
