import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsModule } from './reservations/reservations.module';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ReservationsModule,
    forwardRef(() => TablesModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
