import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacunasService } from './vacunas.service';
import { VacunasController } from './vacunas.controller';
import { Vacunas } from './vacunas.entity';
import { Mascota } from '../mascota/mascota.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacunas, Mascota]) 
  ],
  providers: [VacunasService],
  controllers: [VacunasController],
  exports: [VacunasService],
})
export class VacunasModule {}
