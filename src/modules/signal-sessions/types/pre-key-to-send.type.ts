import { IsNumber, IsString } from 'class-validator';

export class PreKeyToSend {
  @IsNumber()
  id: number;

  @IsString()
  key: string;
}
