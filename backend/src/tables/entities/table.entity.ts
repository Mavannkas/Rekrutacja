import { TableInterface } from 'src/interfaces/table-colletion.interface';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Table extends BaseEntity implements TableInterface {
  @PrimaryGeneratedColumn('uuid')
  table_id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  number: number;

  @Column({
    nullable: false,
  })
  minNumberOfSeats: number;

  @Column({
    nullable: false,
  })
  maxNumberOfSeats: number;

  @OneToMany((type) => Reservation, (entity) => entity.table)
  reservations: Reservation[];
}
