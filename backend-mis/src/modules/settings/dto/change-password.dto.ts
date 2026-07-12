import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword!: string;

  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword!: string;
}
