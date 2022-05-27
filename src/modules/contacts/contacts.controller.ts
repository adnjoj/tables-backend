import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { Contact } from './entities/contact.entity';
import { ImportContactsDto } from './dto/import-contacts.dto';

import { ContactsService } from './contacts.service';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll(@Req() { user }: Request): Promise<Contact[]> {
    return this.contactsService.findAllForUser(user);
  }

  @Post('/import')
  import(
    @Req() { user }: Request,
    @Body() { contacts }: ImportContactsDto,
  ): Promise<Contact[]> {
    return this.contactsService.import(user.id, contacts);
  }
}
