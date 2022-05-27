import { PickType } from '@nestjs/mapped-types';
import { Group } from '../entities/group.entity';

export class CreateGroupDto extends PickType(Group, ['name', 'description']) {}
