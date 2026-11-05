import { BadRequestException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import type { DbClient } from '../db/db.module';
import { operationRounds } from '../db/schema';

export async function getActiveRoundId(db: DbClient, userId: string): Promise<string> {
  const [activeRound] = await db
    .select({ id: operationRounds.id })
    .from(operationRounds)
    .where(and(eq(operationRounds.user_id, userId), eq(operationRounds.is_active, true)))
    .limit(1);

  if (!activeRound) {
    throw new BadRequestException('Create or select an operation round before recording data.');
  }
  return activeRound.id;
}
