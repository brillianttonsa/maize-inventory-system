import { IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteRoundDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  confirmName!: string;
}
