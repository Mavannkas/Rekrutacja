import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  DefaultValuePipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import {
  CreateReservationResponse,
  ReservationsResponse,
} from 'src/responses/reservation.response';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { VerificationDto } from './dto/verification.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<CreateReservationResponse> {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  getReservationsForDate(
    @Query(
      'date',
      new DefaultValuePipe(new Date().toLocaleDateString()),
      new ParseDatePipe(),
    )
    date: Date,
  ): Promise<ReservationsResponse> {
    return this.reservationsService.getReservationsForDate(date);
  }

  @Put(':id')
  sendDeleteRequest(
    @Body() cancelReservationDto: CancelReservationDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.reservationsService.sendDeleteRequest(cancelReservationDto, id);
  }

  @Delete(':id')
  remove(
    @Body() verificationDto: VerificationDto,
    @Param('id') id: string,
  ): Promise<void> {
    return this.reservationsService.remove(verificationDto, id);
  }
}
