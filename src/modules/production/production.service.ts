import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { DB_PROVIDER, type DbClient } from '../../db/db.module';
import { productionBatches } from '../../db/schema';
import { CreateProductionDto } from './dto/create-production.dto';
import { UpdateProductionDto } from './dto/update-production.dto';

const BRAN_DEBE_MULTIPLIERS: Record<string, number> = {
  half_debe: 0.5,
  debe: 1,
  kisado: 0.25,
  gunia: 7,
};

@Injectable()
export class ProductionService {
  constructor(@Inject(DB_PROVIDER) private readonly db: DbClient) {}

  findAll(userId: string) {
    // old app ordered by numeric id; ids are uuids now so we order by created_at instead
    return this.db.query.productionBatches.findMany({
      where: eq(productionBatches.user_id, userId),
      orderBy: asc(productionBatches.created_at),
    });
  }

  async create(userId: string, dto: CreateProductionDto) {
    if (dto.sack_size === undefined) {
      throw new BadRequestException('Sack size is required when recording sacks used');
    }
    const branDebeQuantity = dto.bran_unit_count * BRAN_DEBE_MULTIPLIERS[dto.bran_unit];
    const [newBatch] = await this.db
      .insert(productionBatches)
      .values({
        user_id: userId,
        maize_quantity: dto.maize_quantity,
        flour_output: dto.flour_output,
        // Preserve the old kg column for historical compatibility; new bran is tracked in debe.
        bran_output: dto.bran_output ?? 0,
        bran_debe_quantity: String(branDebeQuantity),
        bran_unit: dto.bran_unit,
        water_usage: dto.water_usage,
        electricity_usage: dto.electricity_usage,
        sacks_used: dto.sacks_used,
        sack_size: dto.sack_size,
        notes: dto.notes,
        date: dto.date,
      })
      .returning();
    return newBatch;
  }

  async update(userId: string, id: string, dto: UpdateProductionDto) {
    const [updatedBatch] = await this.db
      .update(productionBatches)
      .set({
        ...(dto.maize_quantity !== undefined && {
          maize_quantity: dto.maize_quantity,
        }),
        ...(dto.flour_output !== undefined && {
          flour_output: dto.flour_output,
        }),
        ...(dto.bran_output !== undefined && { bran_output: dto.bran_output }),
        ...(dto.bran_unit_count !== undefined && dto.bran_unit !== undefined && {
          bran_debe_quantity: String(dto.bran_unit_count * BRAN_DEBE_MULTIPLIERS[dto.bran_unit]),
          bran_unit: dto.bran_unit,
        }),
        ...(dto.water_usage !== undefined && {
          water_usage: dto.water_usage,
        }),
        ...(dto.electricity_usage !== undefined && {
          electricity_usage: dto.electricity_usage,
        }),
        ...(dto.sacks_used !== undefined && { sacks_used: dto.sacks_used }),
        ...(dto.sack_size !== undefined && { sack_size: dto.sack_size }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.date !== undefined && { date: dto.date }),
      })
      .where(
        and(eq(productionBatches.id, id), eq(productionBatches.user_id, userId)),
      )
      .returning();

    if (!updatedBatch) {
      throw new NotFoundException('Batch not found or nothing to update');
    }
    return updatedBatch;
  }

  async remove(userId: string, id: string) {
    const [deleted] = await this.db
      .delete(productionBatches)
      .where(
        and(eq(productionBatches.id, id), eq(productionBatches.user_id, userId)),
      )
      .returning({ id: productionBatches.id });

    if (!deleted) {
      throw new NotFoundException('Batch not found');
    }
    return { message: 'Batch deleted successfully.' };
  }
}
