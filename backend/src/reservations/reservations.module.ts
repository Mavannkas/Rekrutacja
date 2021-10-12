import { forwardRef, Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TablesModule } from 'src/tables/tables.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [forwardRef(() => TablesModule), MailModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
