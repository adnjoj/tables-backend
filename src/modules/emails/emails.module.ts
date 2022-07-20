import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

import { EnvVariables } from 'src/types/env-variables.type';

import { Email } from './entities/email.entity';
import { VerificationCode } from './entities/verification-code.entity';

import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email, VerificationCode]),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService<EnvVariables>) => ({
        transport: {
          service: 'gmail',
          host: config.get('MAIL_HOST'),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@tables.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [EmailsController],
  providers: [EmailsService],
})
export class EmailsModule {}
