import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProcurementDto {
  @IsNotEmpty({ message: 'Supplier is required' })
  @IsString()
  supplier!: string;

  @IsString()
  supplier_location!: string;

  @IsString()
  supplier_phone!: string;

  @IsNumber()
  @Min(0.01)
  quantity_tons!: number;

  @IsNumber()
  @Min(0.01)
  maize_purchase_cost!: number;

  @IsNumber()
  @Min(0)
  transport_cost!: number;

  @IsNumber() @Min(0) collection_labour!: number;
  @IsNumber() @Min(0) loading_labour!: number;
  @IsNumber() @Min(0) unloading_labour!: number;
  @IsNumber() @Min(0) transport_tax!: number;
  @IsNumber() @Min(0) rural_tax!: number;

  @IsDateString()
  delivery_date!: string;

}
