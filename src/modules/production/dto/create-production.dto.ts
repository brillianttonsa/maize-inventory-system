import { IsDateString, IsIn, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateProductionDto {
  @IsNumber()
  maize_tons!: number;

  @IsOptional()
  @IsInt()
  flour_sacks_5kg?: number;

  @IsOptional()
  @IsInt()
  flour_sacks_10kg?: number;

  @IsOptional()
  @IsInt()
  flour_sacks_25kg?: number;

  @IsOptional()
  @IsNumber()
  bran_unit_count?: number;

  @IsOptional()
  @IsIn(['gunia'])
  bran_unit?: 'gunia';

  @IsDateString()
  date!: string;
}
