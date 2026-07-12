import {
  Inject,
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { eq, and, gt } from 'drizzle-orm';
import { DB_PROVIDER, type  DbClient } from '../../db/db.module';
import { users, passwordResetTokens } from '../../db/schema';
import { env } from '../../config/env';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class AuthService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  async signup({ name, username, email, password }: SignupDto) {
    const emailTaken = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (emailTaken) {
      throw new ConflictException('Email already registered');
    }

    const usernameTaken = await this.db.query.users.findFirst({
      where: eq(users.username, username),
    });
    if (usernameTaken) {
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await this.db
      .insert(users)
      .values({ name, username, email, password: hashedPassword })
      .returning({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
      });

    return newUser;
  }

  async login({ username, password }: LoginDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.username, username),
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) {
      throw new NotFoundException('No user found with that email address');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    // Only one active reset token per user at a time
    await this.db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.user_id, user.id));

    await this.db.insert(passwordResetTokens).values({
      user_id: user.id,
      token: resetToken,
      expires_at: expiresAt,
    });

    const resetLink = `${env.CLIENT_URL}/reset-password/${resetToken}`;

    // TODO: wire up a real email provider; logging for now like the old app did
    console.log('\n========== PASSWORD RESET REQUEST ==========');
    console.log(`Email: ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log('===========================================\n');

    return { resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetRecord = await this.db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false),
        gt(passwordResetTokens.expires_at, new Date()),
      ),
    });

    if (!resetRecord) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, resetRecord.user_id));

    await this.db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    return true;
  }
}
