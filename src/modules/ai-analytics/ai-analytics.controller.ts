import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AiAnalyticsService } from './ai-analytics.service';
import { AiAccessGuard } from './guards/ai-access.guard';
import { type AuthenticatedRequest, JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard, AiAccessGuard)
export class AiAnalyticsController {
  constructor(private readonly aiAnalyticsService: AiAnalyticsService) {}

  @Get('predict-sales')
  predictSales(@Req() req: AuthenticatedRequest) {
    return this.aiAnalyticsService.predictSales(req.user.id);
  }

  @Get('predict-inventory')
  predictInventory(@Req() req: AuthenticatedRequest) {
    return this.aiAnalyticsService.predictInventory(req.user.id);
  }

  @Get('predict-yield')
  predictYield(@Req() req: AuthenticatedRequest) {
    return this.aiAnalyticsService.predictYield(req.user.id);
  }

  @Get('predict-profit')
  predictProfit(@Req() req: AuthenticatedRequest) {
    return this.aiAnalyticsService.predictProfit(req.user.id);
  }

  @Get('alerts')
  getAlerts(@Req() req: AuthenticatedRequest) {
    return this.aiAnalyticsService.getAlerts(req.user.id);
  }

  @Get('recommendations')
  getRecommendations(@Req() req: AuthenticatedRequest) {
    return this.aiAnalyticsService.getRecommendations(req.user.id);
  }
}
