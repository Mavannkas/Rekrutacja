import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { promises } from 'fs';
import { json } from 'stream/consumers';
import {
  TableCollectionInterface,
  TableInterface,
} from './interfaces/table-colletion.interface';
import { TablesService } from './tables/tables.service';
const { readFile } = promises;
@Injectable()
export class AppService {
  constructor(
    @Inject(forwardRef(() => TablesService))
    private tablesService: TablesService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async loadTables() {
    const { tables } = await this.getAllTables();
    let counter = 0;
    for (const table of tables) {
      if (await this.tryToPutTableInDatabase(table)) {
        counter++;
      }
    }

    console.log(`Add ${counter} tables to DB`);
  }

  async getAllTables(): Promise<TableCollectionInterface> {
    const tablesFile = await this.getTablesFromFile();
    return JSON.parse(tablesFile) as TableCollectionInterface;
  }

  async getTablesFromFile(): Promise<string> {
    return await readFile(process.env.TABLE_PATH ?? './seats.json', 'utf-8');
  }

  async tryToPutTableInDatabase(table: TableInterface): Promise<boolean> {
    return await this.tablesService.tryToCreateNewTable(table);
  }
}
