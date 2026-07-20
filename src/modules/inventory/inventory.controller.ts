import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('inventory-movements')
  getMovements(@Req() req: AuthenticatedRequest) {
    return this.inventoryService.getMovements(req.user.id);
  }

  @Get('recent-activities')
  getRecentActivities(@Req() req: AuthenticatedRequest) {
    return this.inventoryService.getRecentActivities(req.user.id);
  }
}
