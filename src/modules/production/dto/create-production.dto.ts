import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductionDto {
  @IsInt()
  maize_quantity!: number;

  @IsInt()
  flour_output!: number;

  @IsOptional()
  @IsInt()
  bran_output?: number;

  @IsNumber()
  bran_unit_count!: number;

  @IsIn(['half_debe', 'debe', 'kisado', 'gunia'])
  bran_unit!: string;

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
