import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Subject is required' })
  @IsString()
  subject: string;

  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  message: string;
}
