import { IsDateString, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductionDto {
  @IsInt()
  maize_quantity!: number;

  @IsInt()
  flour_output!: number;

  @IsInt()
  bran_output!: number;

  @IsInt()
  water_usage!: number;

  @IsInt()
  electricity_usage!: number;

  @IsInt()
  sacks_used!: number;

  @IsIn([5, 10, 25], { message: 'Sack size must be 5, 10, or 25 kg' })
  sack_size!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  date!: string;
}
