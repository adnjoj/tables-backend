import { OmitType } from '@nestjs/mapped-types';

import { Contact } from '../entities/contact.entity';

export class CreateContactDto extends OmitType(Contact, ['id']) {}
