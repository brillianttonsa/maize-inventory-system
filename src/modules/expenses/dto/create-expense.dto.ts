import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  paid_by?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
