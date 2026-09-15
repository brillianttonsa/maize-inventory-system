import { IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString()
  customer_name!: string;

  @IsNotEmpty({ message: 'Customer contact is required' })
  @IsString()
  customer_contact!: string;

  @IsNotEmpty({ message: 'Product type is required' })
  @IsString()
  product_type!: string;

  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsInt()
  sack_count?: number;

  @IsOptional()
  @IsIn([5, 10, 25], { message: 'Sack size must be 5, 10, or 25 kg' })
  sack_size?: number;

  @IsOptional()
  @IsNumber()
  bran_unit_count?: number;

  @IsOptional()
  @IsIn(['gunia'])
  bran_unit?: 'gunia';

  @IsNumber()
  price_per_kg!: number;

  @IsNumber()
  delivery_cost!: number;

  @IsNotEmpty({ message: 'Delivery address is required' })
  @IsString()
  delivery_address!: string;

  @IsNotEmpty({ message: 'Payment method is required' })
  @IsString()
  payment_method!: string;

  @IsNumber()
  total_amount!: number;


  @IsDateString()
  date!: string;
}
