import { IsIn } from 'class-validator';

export const REPORT_TYPES = ['production', 'sales', 'procurement', 'financial'] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

export class GenerateReportDto {
  @IsIn(REPORT_TYPES, { message: 'Invalid report type' })
  type: ReportType;
}
