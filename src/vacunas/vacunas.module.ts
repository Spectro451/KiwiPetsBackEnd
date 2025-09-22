import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacunasService } from './vacunas.service';
import { VacunasController } from './vacunas.controller';
import { Vacunas } from './vacunas.entity';
import { Mascota } from '../mascota/mascota.entity'; 
import { MascotaModule } from 'src/mascota/mascota.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacunas, Mascota]),
    MascotaModule, 
  ],
  providers: [VacunasService],
  controllers: [VacunasController],
  exports: [VacunasService],
})
export class VacunasModule {}
