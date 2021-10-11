import { Table } from 'src/tables/entities/table.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservationStatusEnum } from '../enums/reservation-status.enum';

@Entity()
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  reservation_id: string;

  @Column({
    nullable: false,
  })
  date: Date;

  @Column({
    nullable: false,
  })
  duration: number;

  @Column({
    nullable: false,
  })
  numberOfSeats: number;

  @Column({
    nullable: false,
  })
  seatNumber: number;

  @Column({
    nullable: false,
  })
  fullName: string;

  @Column({
    nullable: false,
  })
  phone: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column()
  status: ReservationStatusEnum;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
    default: null,
  })
  cancellation_code: string | null;

  @Column({
    nullable: true,
    default: null,
  })
  cancellation_code_expire: Date | null;

  @ManyToOne((type) => Table, (entity) => entity.reservations)
  table: Table;
}
