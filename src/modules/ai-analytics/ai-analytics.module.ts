import { Module } from '@nestjs/common';
import { AiAnalyticsService } from './ai-analytics.service';
import { AiAnalyticsController } from './ai-analytics.controller';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [InventoryModule],
  controllers: [AiAnalyticsController],
  providers: [AiAnalyticsService],
})
export class AiAnalyticsModule {}
