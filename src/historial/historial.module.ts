import { Module } from '@nestjs/common';
import { HistorialClinicoService } from './historial.service';
import { HistorialClinicoController } from './historial.controller';

@Module({
  providers: [HistorialClinicoService],
  controllers: [HistorialClinicoController]
})
export class HistorialClinicoModule {}
