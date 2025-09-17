import { Module } from '@nestjs/common';
import { VacunasService } from './vacunas.service';
import { VacunasController } from './vacunas.controller';

@Module({
  providers: [VacunasService],
  controllers: [VacunasController]
})
export class VacunasModule {}
