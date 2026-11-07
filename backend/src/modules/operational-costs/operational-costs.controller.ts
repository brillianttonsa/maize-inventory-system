import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type AuthenticatedRequest, JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOperationalCostDto } from './dto/create-operational-cost.dto';
import { UpdateOperationalCostDto } from './dto/update-operational-cost.dto';
import { OperationalCostsService } from './operational-costs.service';

@Controller('operational-costs')
@UseGuards(JwtAuthGuard)
export class OperationalCostsController {
  constructor(private readonly operationalCostsService: OperationalCostsService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.operationalCostsService.findAll(req.user.id);
  }

  @Get('summary')
  getSummary(@Req() req: AuthenticatedRequest) {
    return this.operationalCostsService.getSummary(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateOperationalCostDto, @Req() req: AuthenticatedRequest) {
    return this.operationalCostsService.create(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOperationalCostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.operationalCostsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.operationalCostsService.remove(req.user.id, id);
  }
}
