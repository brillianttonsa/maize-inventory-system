import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsDateString()
  date!: string;

  @IsNotEmpty({ message: 'Category is required' })
  @IsString()
  category!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unit_value?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unit_cost?: number;

  @IsOptional()
  @IsIn([5, 10, 25], { message: 'Sack size must be 5, 10, or 25 kg' })
  sack_size?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
