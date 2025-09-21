import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';
import { Historial } from './historial.entity';
import { Mascota } from '../mascota/mascota.entity';
import { MascotaModule } from 'src/mascota/mascota.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Historial, Mascota]),
    MascotaModule,
  ],
  providers: [HistorialService],
  controllers: [HistorialController],
})
export class HistorialModule {}
