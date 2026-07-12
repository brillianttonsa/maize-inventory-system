import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export const BILLING_CYCLES = ['quarterly', 'semi_annually', 'yearly'] as const;
export type BillingCycle = (typeof BILLING_CYCLES)[number];

export class CreatePlanDto {
  @IsNotEmpty({ message: 'Plan name is required' })
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price!: number;

  @IsIn(BILLING_CYCLES)
  billing_cycle!: BillingCycle;

  @IsOptional()
  @IsBoolean()
  has_ai_access?: boolean;
}
