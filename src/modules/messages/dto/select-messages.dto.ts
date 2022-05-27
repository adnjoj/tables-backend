import { IsInt, IsOptional } from 'class-validator';

export class SelectMessagesDto {
  @IsOptional()
  @IsInt()
  interlocutorId?: number;

  @IsOptional()
  @IsInt()
  groupId?: number;

  @IsOptional()
  @IsInt()
  offset?: number;

  @IsOptional()
  @IsInt()
  limit?: number;
}
