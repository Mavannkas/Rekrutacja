import {
  IsDateString,
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  date: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(1)
  seatNumber: number;

  @IsString()
  @MinLength(6)
  fullName: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  numberOfSeats: number;
}
