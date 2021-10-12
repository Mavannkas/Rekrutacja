import { IsString, MinLength, minLength } from 'class-validator';

export class CancelReservationDto {
  @IsString()
  @MinLength(3)
  status: string;
}
