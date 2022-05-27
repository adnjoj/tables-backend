import { PickType } from '@nestjs/mapped-types';

import { Email } from '../entities/email.entity';

export class RequestEmailVerificationDto extends PickType(Email, ['email']) {}
