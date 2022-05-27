import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Token } from './types/Token.interface';

import { RegistrationDto } from './dto/registration.dto';

import { LocalAuthGuard } from './guards/local-auth.guard';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() { user }: Request): Promise<Token> {
    return this.authService.login(user);
  }

  @Post('registration')
  register(@Body() credentials: RegistrationDto): Promise<Token> {
    return this.authService.register(credentials);
  }
}
