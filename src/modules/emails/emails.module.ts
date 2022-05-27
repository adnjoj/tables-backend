import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { secret as jwtSecret } from 'src/constants/jwt-constants';

import { UsersModule } from '../users/users.module';

import { Email } from './entities/email.entity';
import { VerificationCode } from './entities/verification-code.entity';

import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email, VerificationCode]),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'tables.conference@gmail.com',
          pass: 'gyrewattlsmcfhcg',
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
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '60d' },
    }),
    UsersModule,
  ],
  controllers: [EmailsController],
  providers: [EmailsService],
})
export class EmailsModule {}
