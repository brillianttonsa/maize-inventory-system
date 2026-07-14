import { Module } from '@nestjs/common';
import { AiAnalyticsService } from './ai-analytics.service';
import { AiAnalyticsController } from './ai-analytics.controller';
import { AiAccessGuard } from './guards/ai-access.guard';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [InventoryModule],
  controllers: [AiAnalyticsController],
  providers: [AiAnalyticsService, AiAccessGuard],
})
export class AiAnalyticsModule {}
