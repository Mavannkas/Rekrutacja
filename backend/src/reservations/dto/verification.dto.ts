import { IsString, MaxLength, MinLength } from 'class-validator';

export class VerificationDto {
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  verificationCode: string;
}
