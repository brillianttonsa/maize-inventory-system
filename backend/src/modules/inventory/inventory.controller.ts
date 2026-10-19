import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  DashboardSummaryQueryDto,
  PaginationQueryDto,
} from '../../common/dto/pagination-query.dto';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('inventory-movements')
  getMovements(
    @Req() req: AuthenticatedRequest,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.inventoryService.getMovements(req.user.id, pagination);
  }

  @Get('recent-activities')
  getRecentActivities(@Req() req: AuthenticatedRequest) {
    return this.inventoryService.getRecentActivities(req.user.id);
  }

  @Get('dashboard-summary')
  getDashboardSummary(
    @Req() req: AuthenticatedRequest,
    @Query() query: DashboardSummaryQueryDto,
  ) {
    return this.inventoryService.getDashboardSummary(req.user.id, query.date);
  }
}
