import { Module } from '@nestjs/common';

import { SessionsStore } from './stores/sessions.store';
import { ServerSessionStore } from './stores/server-session.store';

import { SignalSessionsService } from './signal-sessions.service';
import { SignalSessionsController } from './signal-sessions.controller';

@Module({
  providers: [SignalSessionsService, SessionsStore, ServerSessionStore],
  controllers: [SignalSessionsController],
  exports: [SignalSessionsService],
})
export class SignalSessionsModule {}
