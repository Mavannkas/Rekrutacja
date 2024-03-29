import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { min } from 'class-validator';
import { MailService } from 'src/mail/mail.service';
import {
  CreateReservationResponse,
  ReservationsResponse,
} from 'src/responses/reservation.response';
import { Table } from 'src/tables/entities/table.entity';
import { TablesService } from 'src/tables/tables.service';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { VerificationDto } from './dto/verification.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationStatusEnum } from './enums/reservation-status.enum';

const HOUR_IN_MS = 60 * 60 * 1000;

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
    const inputedDate = new Date(createReservationDto.date);
    console.log(inputedDate);
    if (
      !this.tablesService.isTableAvailable(
        table,
        inputedDate,
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

  async getReservationsForDate(date: Date): Promise<ReservationsResponse> {
    const reservations = await (
      await Reservation.find()
    ).filter((reservation) => {
      const startReservation = reservation.date.getTime();
      const endReservation =
        startReservation + (reservation.duration - 1) * HOUR_IN_MS;
      return reservation.date.toDateString() === date.toDateString();
    });
    console.log(reservations);
    return reservations.map(this.reservationMapper);
  }

  reservationMapper = ({
    date,
    duration,
    seatNumber,
    fullName,
    phone,
    email,
    numberOfSeats,
  }: Reservation): CreateReservationDto => {
    return {
      date: date.toLocaleString(),
      duration,
      seatNumber,
      fullName,
      phone,
      email,
      numberOfSeats,
    };
  };

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

  async sendDeleteRequest(
    cancelReservationDto: CancelReservationDto,
    id: string,
  ): Promise<void> {
    if (cancelReservationDto.status !== 'requested cancellation') {
      throw new BadRequestException('Bad status');
    }

    const reservation = await Reservation.findOne({
      where: { reservation_id: id },
    });

    if (!reservation) {
      throw new NotFoundException('This id not exists');
    }

    if (reservation.date.getTime() - Date.now() <= 2 * HOUR_IN_MS) {
      throw new ForbiddenException('Too late to cancel');
    }

    reservation.status = ReservationStatusEnum.requestedCancellation;
    reservation.cancellation_code = Math.floor(
      Math.random() * 90000 + 10000,
    ).toString();

    await reservation.save();
    await this.mailService.sendCancelation(reservation);
  }

  async remove(verificationDto: VerificationDto, id: string): Promise<void> {
    const reservation = await Reservation.findOne({
      where: {
        reservation_id: id,
        cancellation_code: verificationDto.verificationCode,
      },
    });

    if (!reservation) {
      throw new NotFoundException();
    }

    await this.mailService.sendSubmit(reservation);
    await reservation.remove();
  }

  isDatesOverlap(
    firstDate: Date,
    secondDate: Date,
    firstDuration: number,
    secondDuration: number,
  ): boolean {
    const firstStart = new Date(firstDate).getTime();
    const firstEnd = firstStart + (firstDuration - 1) * HOUR_IN_MS;

    const secondStart = new Date(secondDate).getTime();
    const secondEnd = secondStart + (secondDuration - 1) * HOUR_IN_MS;
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
