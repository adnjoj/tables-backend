import { Body, Controller, Post } from '@nestjs/common';

import { CheckPhoneDto } from './dto/check-phone.dto';

import { UsersService } from 'src/modules/users/users.service';

@Controller('app')
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Post('check_phone')
  async checkPhone(
    @Body() { phone }: CheckPhoneDto,
  ): Promise<{ valid: boolean }> {
    return { valid: await this.usersService.checkPhone(phone) };
  }
}
