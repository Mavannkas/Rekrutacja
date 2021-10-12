import {
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { CreateReservationResponse } from 'src/responses/reservation.response';
import { Table } from 'src/tables/entities/table.entity';
import { TablesService } from 'src/tables/tables.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationStatusEnum } from './enums/reservation-status.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(forwardRef(() => TablesService))
    private tablesService: TablesService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
  ) {}
  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<CreateReservationResponse> {
    const table = await Table.findOne({
      relations: ['reservations'],
      where: {
        number: createReservationDto.seatNumber,
      },
    });

    if (typeof table === 'undefined') {
      throw new NotFoundException('This table not exists');
    }

    if (
      !this.tablesService.isTableAvailable(
        table,
        new Date(createReservationDto.date),
        createReservationDto.duration,
      )
    ) {
      throw new NotAcceptableException('Table is unavaible');
    }

    const reservation = await this.createNewReservation(
      createReservationDto,
      table,
    );

    await this.mailService.sendConfirmation(reservation);

    return {
      reservationId: reservation.reservation_id,
    };
  }

  async createNewReservation(
    createReservationDto: CreateReservationDto,
    table: Table,
  ): Promise<Reservation> {
    const reservation = new Reservation();
    reservation.email = createReservationDto.email;
    reservation.fullName = createReservationDto.fullName;
    reservation.numberOfSeats = createReservationDto.numberOfSeats;
    reservation.phone = createReservationDto.phone;
    reservation.seatNumber = createReservationDto.seatNumber;
    reservation.date = new Date(createReservationDto.date);
    reservation.duration = createReservationDto.duration;
    reservation.status = ReservationStatusEnum.reserved;
    await reservation.save();

    table.reservations.push(reservation);
    await table.save();

    return reservation;
  }

  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: string) {
    return `This action returns a #${id} reservation`;
  }

  sendDeleteRequest(id: string) {
    return `This action send remove request to ${id}`;
  }

  remove(id: string) {
    return `This action removes a #${id} reservation`;
  }

  isDatesOverlap(
    firstDate: Date,
    secondDate: Date,
    firstDuration: number,
    secondDuration: number,
  ): boolean {
    const firstStart = new Date(firstDate).getTime();
    const firstEnd = firstStart + (firstDuration - 1) * 24 * 60 * 60 * 1000;

    const secondStart = new Date(secondDate).getTime();
    const secondEnd = secondStart + (secondDuration - 1) * 24 * 60 * 60 * 1000;
    if (
      (firstStart <= secondStart && secondStart <= firstEnd) ||
      (firstStart <= secondEnd && secondEnd <= firstEnd) ||
      (secondStart <= firstStart && firstEnd <= secondEnd)
    ) {
      return true;
    }
    return false;
  }
}
