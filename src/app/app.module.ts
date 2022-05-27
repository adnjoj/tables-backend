import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { getConnectionOptions } from 'typeorm';

import { CaslModule } from 'src/modules/casl/casl.module';
import { UsersModule } from '../modules/users/users.module';
import { AuthModule } from '../modules/auth/auth.module';
import { ContactsModule } from 'src/modules/contacts/contacts.module';
import { GroupsModule } from 'src/modules/groups/groups.module';
import { SignalSessionsModule } from 'src/modules/signal-sessions/signal-sessions.module';
import { MessagesModule } from 'src/modules/messages/messages.module';
import { EmailsModule } from 'src/modules/emails/emails.module';

import { ForbiddenErrorFilter } from 'src/filters/forbidden-error.filter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    CaslModule,
    UsersModule,
    AuthModule,
    ContactsModule,
    GroupsModule,
    SignalSessionsModule,
    MessagesModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ForbiddenErrorFilter,
    },
  ],
})
export class AppModule {}
