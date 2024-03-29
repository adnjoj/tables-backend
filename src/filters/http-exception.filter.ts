import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const { message, error } = exception.getResponse() as {
      message: string | string[];
      error: string;
    };

    const messagesArray = Array.isArray(message) ? message : [message];

    response.status(status).json({
      statusCode: status,
      messages: messagesArray,
      error,
    });
  }
}
