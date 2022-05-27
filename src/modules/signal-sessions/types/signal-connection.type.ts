import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

import { PreKeyToSend } from './pre-key-to-send.type';
import { SignedPreKeyToSend } from './signed-pre-key-to-send.type';

export class SignalConnection {
  @IsInt()
  userId!: number;

  @IsInt()
  registrationId!: number;

  @IsString()
  identityKey!: string;

  @Type(() => SignedPreKeyToSend)
  @IsObject()
  @ValidateNested()
  signedPreKey: SignedPreKeyToSend;

  @Type(() => PreKeyToSend)
  @IsArray()
  @ValidateNested({ each: true })
  preKeys: PreKeyToSend[];
}
