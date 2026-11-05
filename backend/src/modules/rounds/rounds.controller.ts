import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';
import { CreateRoundDto } from './dto/create-round.dto';
import { DeleteRoundDto } from './dto/delete-round.dto';
import { RoundsService } from './rounds.service';

@Controller('rounds')
@UseGuards(JwtAuthGuard)
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.roundsService.findAll(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateRoundDto, @Req() req: AuthenticatedRequest) {
    return this.roundsService.create(req.user.id, dto.name);
  }

  @Post(':id/activate')
  activate(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.roundsService.activate(req.user.id, id);
  }

  @Get(':id/report')
  async getReport(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const { filename, csv } = await this.roundsService.getReport(req.user.id, id);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Body() dto: DeleteRoundDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.roundsService.remove(req.user.id, id, dto.confirmName);
  }
}
