import { IsDateString, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductionDto {
  @IsNumber()
  @Min(0.01)
  maize_tons!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  flour_sacks_5kg?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  flour_sacks_10kg?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  flour_sacks_25kg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bran_quantity?: number;

  @IsDateString()
  date!: string;
}
