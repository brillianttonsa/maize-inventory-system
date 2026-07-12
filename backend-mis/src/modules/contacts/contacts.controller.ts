import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async submit(@Body() dto: CreateContactDto) {
    const contactId = await this.contactsService.submit(dto);
    return {
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      contactId,
    };
  }
}
