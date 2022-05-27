import { IsPhoneNumber, IsString } from 'class-validator';

export class CheckPhoneDto {
  @IsString()
  @IsPhoneNumber()
  phone: string;
}
