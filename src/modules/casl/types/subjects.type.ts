import { InferSubjects } from '@casl/ability';

import { Contact } from 'src/modules/contacts/entities/contact.entity';
import { Group } from 'src/modules/groups/entities/group.entity';

export type Subjects = InferSubjects<typeof Contact | typeof Group> | 'all';
