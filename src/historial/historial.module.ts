import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { Historial } from './historial.entity';
import { Mascota } from '../mascota/mascota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Historial, Mascota])],
  providers: [HistorialService],
  controllers: [HistorialController],
})
export class HistorialModule {}
