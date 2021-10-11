import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TableInterface } from 'src/interfaces/table-colletion.interface';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { ReservationStatusEnum } from 'src/reservations/enums/reservation-status.enum';
import { ReservationsService } from 'src/reservations/reservations.service';
import {
  AllTablesResponse,
  GetTableResponse,
} from 'src/responses/table.response';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Table } from './entities/table.entity';

@Injectable()
export class TablesService {
  constructor(
    @Inject(forwardRef(() => ReservationsService))
    private reservationService: ReservationsService,
  ) {}
  async getAllFreeTables(
    date: Date,
    seats: number,
    duration: number,
  ): Promise<AllTablesResponse> {
    const tables = (
      await Table.find({
        relations: ['reservations'],
        where: {
          minNumberOfSeats: LessThanOrEqual(seats),
          maxNumberOfSeats: MoreThanOrEqual(seats),
        },
      })
    ).filter((item) => this.isTableAvailable(item, date, duration));
    return tables.map(this.prepareTableResponse);
  }

  isTableAvailable(
    { reservations }: { reservations: Reservation[] },
    date: Date,
    duration: number,
  ): boolean {
    for (const reservation of reservations) {
      if (
        this.reservationService.isDatesOverlap(
          reservation.date,
          date,
          reservation.duration,
          duration,
        )
      ) {
        return false;
      }
    }
    return true;
  }

  prepareTableResponse(table: Table): GetTableResponse {
    return {
      number: table.number,
      maxNumberOfSeats: table.maxNumberOfSeats,
      minNumberOfSeats: table.minNumberOfSeats,
    };
  }

  async tryToCreateNewTable(table: TableInterface): Promise<boolean> {
    const isTableExist = await this.checkIsTableExist(table);
    if (!isTableExist) {
      await this.createTable(table);
    }
    return !isTableExist;
  }

  async checkIsTableExist(table: TableInterface): Promise<boolean> {
    const foundTable = await Table.findOne({
      where: {
        number: table.number,
      },
    });
    return Boolean(foundTable);
  }

  async createTable(table: TableInterface): Promise<void> {
    const newTable = new Table();
    newTable.number = table.number;
    newTable.maxNumberOfSeats = table.maxNumberOfSeats;
    newTable.minNumberOfSeats = table.minNumberOfSeats;
    await newTable.save();
  }
}
