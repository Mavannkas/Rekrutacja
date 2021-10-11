export interface TableInterface {
  number: number;
  minNumberOfSeats: number;
  maxNumberOfSeats: number;
}

export interface TableCollectionInterface {
  tables: TableInterface[];
}
