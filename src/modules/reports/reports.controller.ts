import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  async generate(
    @Body() dto: GenerateReportDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const { filename, csv } = await this.reportsService.generateReport(
      req.user.id,
      dto.type,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Get('comprehensive')
  async getComprehensive(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const { filename, csv } = await this.reportsService.generateComprehensiveReport(req.user.id);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
