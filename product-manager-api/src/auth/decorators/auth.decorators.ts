import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true); // Torna uma rota pública

export const GetUser = createParamDecorator( // retorna o req.user
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
