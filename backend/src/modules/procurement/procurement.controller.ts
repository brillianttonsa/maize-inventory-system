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
import { ProcurementService } from './procurement.service';
import { CreateProcurementDto } from './dto/create-procurement.dto';
import { UpdateProcurementDto } from './dto/update-procurement.dto';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

@Controller('procurement')
@UseGuards(JwtAuthGuard)
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.procurementService.findAll(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateProcurementDto, @Req() req: AuthenticatedRequest) {
    return this.procurementService.create(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProcurementDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.procurementService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.procurementService.remove(req.user.id, id);
  }
}
