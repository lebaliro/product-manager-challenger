import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggerGlobal } from '../logger/logger.provider';

@Catch()
export class CatchFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggerGlobal,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const { statusCode, message } =
      exception instanceof HttpException
        ? {
            statusCode: exception.getStatus(),
            message: exception.message,
          }
        : {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Erro de servidor',
          };

    const responseBody = {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    const messageLogger = {
      ...responseBody,
      errorMessage: String(exception),
    };

    this.logger.error(messageLogger);

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
