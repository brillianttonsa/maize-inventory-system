import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  date!: string;
}
