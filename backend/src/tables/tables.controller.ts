import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import { ReservationStatusEnum } from 'src/reservations/enums/reservation-status.enum';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  getAllFree(
    @Query(
      'start_date',
      new DefaultValuePipe(new Date().toLocaleDateString()),
      new ParseDatePipe(),
    )
    date: Date,
    @Query('min_seats', new DefaultValuePipe(1), new ParseIntPipe())
    seats: number,
    @Query('status')
    status: string,
    @Query('duration', new DefaultValuePipe(1), new ParseIntPipe())
    duration: number,
  ) {
    return this.tablesService.getAllFreeTables(date, seats, duration);
  }
}
