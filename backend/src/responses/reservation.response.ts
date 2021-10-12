import { CreateReservationDto } from 'src/reservations/dto/create-reservation.dto';

export interface CreateReservationResponse {
  reservationId: string;
}

export type ReservationsResponse = CreateReservationDto[];
