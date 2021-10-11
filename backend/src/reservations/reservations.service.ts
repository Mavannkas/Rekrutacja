import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  create(createReservationDto: CreateReservationDto) {
    return 'This action adds a new reservation';
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
    const firstStart = new Date(firstDate.toLocaleDateString()).getTime();
    const firstEnd = firstStart + firstDuration * 24 * 60 * 60 * 100;

    const secondStart = new Date(secondDate.toLocaleDateString()).getTime();
    const secondEnd = secondStart + secondDuration * 24 * 60 * 60 * 100;
    if (
      (firstStart >= secondStart && firstEnd <= secondStart) ||
      (firstStart >= secondEnd && firstEnd <= secondEnd)
    ) {
      return true;
    }
    return false;
  }
}
