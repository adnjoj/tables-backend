import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';

import { Contact } from './entities/contact.entity';
import { User } from '../users/entities/user.entity';

import { CreateContactDto } from './dto/create-contact.dto';
import { ImportContactDto } from './dto/import-contact.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly usersService: UsersService,
  ) {}

  findAllForUser({ id }: User): Promise<Contact[]> {
    return this.contactRepository
      .createQueryBuilder('contacts')
      .leftJoin('contacts.owner', 'owner')
      .leftJoinAndSelect('contacts.target', 'target')
      .where('owner.id = :id', { id })
      .getMany();
  }

  async import(
    ownerId: number,
    contacts: ImportContactDto[],
  ): Promise<Contact[]> {
    const owner = await this.usersService.findOne({ id: ownerId });

    await Promise.all(
      contacts.map(async (contact) => {
        const { label } = contact;
        const target = await this.getUserFromImportDto(contact);
        if (!target) return null;

        return this.createOrUpdate({ label, target, owner });
      }),
    );

    return this.contactRepository.find({ where: { owner } });
  }

  createOrUpdate(dto: CreateContactDto): Promise<InsertResult> {
    return this.contactRepository
      .createQueryBuilder()
      .insert()
      .into(Contact)
      .values(dto)
      .orUpdate(['label'])
      .execute();
  }

  async getUserFromImportDto({
    email,
    phone,
  }: ImportContactDto): Promise<User | null> {
    const userWithEmail = await this.usersService.findOne({ email });
    const userWithPhone = await this.usersService.findOne({ phone });
    return userWithPhone ?? userWithEmail;
  }
}
