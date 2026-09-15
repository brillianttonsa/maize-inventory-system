import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProcurementDto {
  @IsNotEmpty({ message: 'Supplier is required' })
  @IsString()
  supplier!: string;

  @IsNumber()
  quantity_tons!: number;

  @IsNumber()
  price_per_kg!: number;

  @IsNumber()
  transport_cost!: number;

  @IsNumber()
  total_cost!: number;

  @IsDateString()
  delivery_date!: string;

}
