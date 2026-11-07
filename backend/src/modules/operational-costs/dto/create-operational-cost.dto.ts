import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOperationalCostDto {
  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  operation!: string;

  @IsNumber()
  @Min(0)
  starting_units!: number;

  @IsNumber()
  @Min(0)
  remaining_units!: number;

  @IsNumber()
  @Min(0)
  total_amount!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
