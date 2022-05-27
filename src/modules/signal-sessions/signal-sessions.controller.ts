import { Body, Controller, Post } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';

import { SignalConnection } from './types/signal-connection.type';

import { SignalSessionsService } from './signal-sessions.service';

@Controller('signal-sessions')
export class SignalSessionsController {
  constructor(private readonly signalSessionsService: SignalSessionsService) {}

  @Post()
  createSession(@Body() dto: CreateSessionDto): SignalConnection {
    return this.signalSessionsService.createSession(dto);
  }
}
