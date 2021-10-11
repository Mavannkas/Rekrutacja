import { forwardRef, Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [forwardRef(() => ReservationsModule)],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}
