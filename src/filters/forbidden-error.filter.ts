import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';
import { Response } from 'express';

import { AppAbility } from 'src/modules/casl/types/app-ability.type';

@Catch(ForbiddenError)
export class ForbiddenErrorFilter implements ExceptionFilter {
  catch(exception: ForbiddenError<AppAbility>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(403).json({
      statusCode: 403,
      message: exception.message,
      error: 'Forbidden',
    });
  }
}
