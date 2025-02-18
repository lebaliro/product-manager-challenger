import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateDto } from './dtos/user.dto';
import { createHash } from 'crypto';
import { LoggerGlobal } from 'src/common/logger/logger.provider';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { USER_ALREADY_EXISTS } from './utils/auth.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerGlobal,
  ) {}

  async validateApiKey(apikey: string) {
    this.logger.log('Iniciado Validação da Api Key');

    const user = await this.prisma.user.findFirst({
      where: {
        apikey,
      },
    });

    this.logger.log('Finalizado Validação da Api Key');

    return user;
  }

  async createUser(userCreateDto: UserCreateDto) {
    this.logger.log('Iniciado Criação do Usuário');

    const { cpf } = userCreateDto;

    const apikey = this.generateApiKey(cpf);

    try {
      const user = await this.prisma.user.create({
        data: {
          cpf,
          apikey,
        },
      });

      const response = {
        apikey: user.apikey,
      };
      this.logger.log('Finalizado Criação do Usuário');

      return response;
    } catch (e) {
      this.logger.error(e);
      if (e instanceof PrismaClientKnownRequestError) {
        const error: PrismaClientKnownRequestError = e;
        if (error.code == 'P2002') {
          // code P2002 is to "Unique constraint failed on the {constraint}"
          throw new HttpException(USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
        }
      }
      throw e;
    }
  }

  generateApiKey(cpf: string): string {
    this.logger.log('Iniciado Geração de ApiKey');

    const salt = process.env.SALT_TO_API_KEY;
    const input = cpf + salt;

    const hash = createHash('sha256')
      .update(input)
      .digest('hex')
      .substring(0, 48);

    this.logger.log('Finalizado Geração de ApiKey');

    return hash;
  }
}
