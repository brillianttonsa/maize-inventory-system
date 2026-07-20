import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // Public: browse the plan catalog before signing in
  @Get('plans')
  findActivePlans() {
    return this.subscriptionsService.findActivePlans();
  }

  // NOTE: no admin role exists yet in this app; these two are behind auth only.
  // Add a role check here once you have one.
  @Post('plans')
  @UseGuards(JwtAuthGuard)
  createPlan(@Body() dto: CreatePlanDto) {
    return this.subscriptionsService.createPlan(dto);
  }

  @Patch('plans/:id')
  @UseGuards(JwtAuthGuard)
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.subscriptionsService.updatePlan(id, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMySubscription(@Req() req: AuthenticatedRequest) {
    return this.subscriptionsService.getMySubscription(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  subscribe(
    @Body() dto: CreateSubscriptionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.subscriptionsService.subscribe(req.user.id, dto);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.subscriptionsService.cancel(req.user.id, id);
  }

  @Post('payments')
  @UseGuards(JwtAuthGuard)
  recordPayment(
    @Body() dto: CreatePaymentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.subscriptionsService.recordPayment(req.user.id, dto);
  }
}
