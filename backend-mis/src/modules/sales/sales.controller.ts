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
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.salesService.findAll(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateSaleDto, @Req() req: AuthenticatedRequest) {
    return this.salesService.create(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSaleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.salesService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.salesService.remove(req.user.id, id);
  }
}
