import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { users } from '../../db/schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class SettingsService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const [updated] = await this.db
      .update(users)
      .set({ name: dto.name, email: dto.email })
      .where(eq(users.id, userId))
      .returning({ id: users.id, name: users.name, email: users.email });

    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!valid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hash = await bcrypt.hash(dto.newPassword, 10);
    await this.db.update(users).set({ password: hash }).where(eq(users.id, userId));

    return true;
  }
}
