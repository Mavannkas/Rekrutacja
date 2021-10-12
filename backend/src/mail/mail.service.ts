import { MailerService } from '@nest-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmation(reservation: Reservation) {
    await this.mailerService.sendMail({
      to: reservation.email,
      subject: 'Your reservation',
      template: './reservation',
      from: 'rhett.pacocha94@ethereal.email',
      context: {
        name: reservation.fullName,
        date: reservation.date.toLocaleString(),
        duration: reservation.duration,
        id: reservation.reservation_id,
        table: reservation.seatNumber,
        seats: reservation.numberOfSeats,
      },
    });
  }

  async sendCancelation(reservation: Reservation) {
    await this.mailerService.sendMail({
      to: reservation.email,
      subject: 'Cancel',
      template: './cancelation',
      from: 'rhett.pacocha94@ethereal.email',
      context: {
        id: reservation.reservation_id,
        name: reservation.fullName,
        code: reservation.cancellation_code,
      },
    });
  }

  async sendSubmit(reservation: Reservation) {
    await this.mailerService.sendMail({
      to: reservation.email,
      subject: 'Submin Cancellation',
      template: './remove',
      from: 'rhett.pacocha94@ethereal.email',
      context: {
        name: reservation.fullName,
        id: reservation.reservation_id,
        date: reservation.date.toLocaleString(),
      },
    });
  }
}
