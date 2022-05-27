import { IsEmail, IsString } from 'class-validator';

export class CheckEmailDto {
  @IsString()
  @IsEmail()
  email: string;
}
