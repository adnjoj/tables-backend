import { IsString } from 'class-validator';

import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class RegistrationDto extends CreateUserDto {
  @IsString()
  token!: string;
}
