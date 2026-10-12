import { Inject, Injectable } from '@nestjs/common';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { contacts } from '../../db/schema';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async submit(dto: CreateContactDto) {
    const [saved] = await this.db
      .insert(contacts)
      .values({
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
      })
      .returning({ id: contacts.id });

    console.log(`[Contact] New message saved from ${dto.name} (${dto.email})`);

    // Email delivery was simulated (console-logged) in the old app too.
    // TODO: wire up a real email provider (SendGrid, Nodemailer, etc.)
    console.log('\n========== NEW CONTACT MESSAGE ==========');
    console.log(`From: ${dto.name} <${dto.email}>`);
    console.log(`Subject: ${dto.subject}`);
    console.log(`Message:\n${dto.message}`);
    console.log('=========================================\n');

    return saved.id;
  }
}
