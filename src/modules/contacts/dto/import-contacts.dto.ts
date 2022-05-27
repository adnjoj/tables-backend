import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { ImportContactDto } from './import-contact.dto';

export class ImportContactsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportContactDto)
  contacts!: Array<ImportContactDto>;
}
