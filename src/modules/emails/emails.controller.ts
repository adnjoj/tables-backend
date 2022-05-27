import { Controller, Post, Body } from '@nestjs/common';

import { CheckEmailDto } from './dto/check-email.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

import { RequestEmailVerificationDto } from './dto/request-email-verification.dto';

import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('check')
  checkEmail(@Body() { email }: CheckEmailDto): Promise<{ valid: boolean }> {
    return this.emailsService.checkEmail(email);
  }

  @Post('request_verification')
  requestEmailVerification(
    @Body() { email }: RequestEmailVerificationDto,
  ): Promise<{ requestTime: Date }> {
    return this.emailsService.requestVerification(email);
  }

  @Post('verify')
  verifyEmail(
    @Body() { email, code }: VerifyEmailDto,
  ): Promise<{ token: string }> {
    return this.emailsService.verify(email, code);
  }
}
