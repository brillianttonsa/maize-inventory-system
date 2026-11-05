import { IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString()
  customer_name!: string;

  @IsNotEmpty({ message: 'Customer contact is required' })
  @IsString()
  customer_contact!: string;

  @IsNotEmpty({ message: 'Product type is required' })
  @IsIn(['flour', 'bran'])
  product_type!: string;

  @IsInt()
  @Min(1)
  sack_count!: number;

  @IsOptional()
  @IsIn([5, 10, 25], { message: 'Sack size must be 5, 10, or 25 kg' })
  sack_size?: number;

  @IsNumber()
  @Min(0.01)
  price_per_sack!: number;

  @IsNumber()
  @Min(0)
  delivery_cost!: number;

  @IsNotEmpty({ message: 'Delivery address is required' })
  @IsString()
  delivery_address!: string;

  @IsDateString()
  date!: string;
}
