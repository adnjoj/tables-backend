import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Repository, MoreThanOrEqual } from 'typeorm';

import { Email } from './entities/email.entity';
import { VerificationCode } from './entities/verification-code.entity';

import { UsersService } from '../users/users.service';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {
    verificationCodeRepository.delete({ id: MoreThanOrEqual(0) });
  }

  async checkEmail(email: string): Promise<{ exists: boolean }> {
    return { exists: Boolean(await this.usersService.findOne({ email })) };
  }

  async requestVerification(email: string): Promise<{ requestTime: Date }> {
    const user = await this.usersService.findOne({ email });
    if (user) throw new ForbiddenException('That email is already taken');

    const emailToUpdate = await this.emailRepository.findOne({
      where: { email },
    });

    if (!emailToUpdate) this.emailRepository.save({ email });
    else {
      emailToUpdate.isVerified = false;
      this.emailRepository.save(emailToUpdate);
    }

    await this.sendVerificationCode(email);

    return { requestTime: new Date() };
  }

  async verify(email: string, code: string): Promise<{ token: string }> {
    const codeForEmail = await this.verificationCodeRepository.findOne({
      where: { email },
    });

    if (!codeForEmail) {
      throw new ForbiddenException('Code for that email is not generated');
    }

    if (codeForEmail.code !== code) {
      throw new ForbiddenException('Code does not math generated one');
    }

    if (Date.now() - new Date(codeForEmail.createdAt).getTime() >= 90000) {
      await this.verificationCodeRepository.delete({ id: codeForEmail.id });
      throw new ForbiddenException('Code confirmation time limit exceeded');
    }

    await this.verificationCodeRepository.delete({ id: codeForEmail.id });
    await this.emailRepository.update({ email: email }, { isVerified: true });
    return { token: this.jwtService.sign({ email, code }) };
  }

  private async sendVerificationCode(email: string): Promise<void> {
    const { code } = await this.generateVerificationCode(email);

    this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your Email',
      template: 'confirmation',
      context: { code },
    });
  }

  private async generateVerificationCode(
    email: string,
  ): Promise<VerificationCode> {
    const codeLength = 6;
    const codeArray = [];

    for (let i = 0; i < codeLength; i += 1) {
      codeArray.push(Math.floor(Math.random() * 10));
    }

    const code = codeArray.join('');
    await this.verificationCodeRepository.delete({ email });

    return this.verificationCodeRepository.save({ code, email });
  }
}
