import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsDateString()
  date!: string;

  @IsNotEmpty({ message: 'Category is required' })
  @IsString()
  category!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsNumber()
  unit_value?: number;

  @IsOptional()
  @IsNumber()
  unit_cost?: number;

  @IsOptional()
  @IsIn([5, 10, 25], { message: 'Sack size must be 5, 10, or 25 kg' })
  sack_size?: number;

  @IsOptional()
  @IsString()
  paid_by?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
