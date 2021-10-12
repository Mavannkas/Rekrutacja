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
} from '@nestjs/common';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import {
  CreateReservationResponse,
  ReservationsResponse,
} from 'src/responses/reservation.response';
import { CreateReservationDto } from './dto/create-reservation.dto';
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
  sendDeleteRequest(@Param('id') id: string) {
    return this.reservationsService.sendDeleteRequest(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
