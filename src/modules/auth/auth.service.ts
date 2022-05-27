import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

import { User } from '../users/entities/user.entity';

import { Token } from './types/Token.interface';
import { RegistrationDto } from './dto/registration.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async checkCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne({ email });
    if (!user) return null;

    const passwordIsCorrect = await compare(password, user.password);
    return passwordIsCorrect ? user : null;
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const { sub } = this.jwtService.verify(token);
      const user = await this.usersService.findOne({ id: sub });

      return user;
    } catch (error) {
      return null;
    }
  }

  async login({ id, email }: User): Promise<Token> {
    return { token: this.jwtService.sign({ email, sub: id }) };
  }

  async register({
    username,
    password,
    email,
    token,
  }: RegistrationDto): Promise<Token> {
    if ((await this.usersService.findOne({ email })) != null) {
      throw new BadRequestException('User with such email already exists');
    }

    if ((await this.usersService.findOne({ username })) != null) {
      throw new BadRequestException('User with such username already exists');
    }

    const decodedToken = (await this.jwtService.decode(token)) as any;
    if (decodedToken?.email !== email) {
      throw new BadRequestException('Wrong token');
    }

    const hashedPassword = await hash(password, 10);
    const newUserData = { email, username, password: hashedPassword };
    const user = await this.usersService.create(newUserData);

    return { token: this.jwtService.sign({ username, sub: user.id }) };
  }
}
