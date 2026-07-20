import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export const PAYMENT_METHODS = ['bank_transfer', 'mobile_money', 'card'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ['success', 'failed', 'pending'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export class CreatePaymentDto {
  @IsUUID()
  subscription_id!: string;

  @IsNumber()
  amount!: number;

  @IsIn(PAYMENT_METHODS)
  payment_method!: PaymentMethod;

  @IsOptional()
  @IsString()
  transaction_reference?: string;

  @IsIn(PAYMENT_STATUSES)
  status!: PaymentStatus;
}
