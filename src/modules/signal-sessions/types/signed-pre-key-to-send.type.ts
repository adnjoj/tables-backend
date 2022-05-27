import { IsNumber, IsString } from 'class-validator';

export class SignedPreKeyToSend {
  @IsNumber()
  id: number;

  @IsString()
  key: string;

  @IsString()
  signature: string;
}
