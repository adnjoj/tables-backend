import { Controller, Req, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findLoggedUser(@Req() { user }: Request) {
    return user;
  }

  @Patch('me')
  updateLoggedUser(@Req() { user }: Request, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto);
  }
}
