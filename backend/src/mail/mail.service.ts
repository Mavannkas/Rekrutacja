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
        date: reservation.date.toLocaleDateString(),
        duration: reservation.duration,
        id: reservation.reservation_id,
        table: reservation.seatNumber,
        seats: reservation.numberOfSeats,
      },
    });
  }
}
