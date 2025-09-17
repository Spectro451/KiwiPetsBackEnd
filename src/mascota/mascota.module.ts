import { Module } from '@nestjs/common';
import { MascotaService } from './mascota.service';
import { MascotaController } from './mascota.controller';
import { MascotaController } from './mascota.controller';
import { MascotaService } from './mascota.service';

@Module({
  providers: [MascotaService],
  controllers: [MascotaController]
})
export class MascotaModule {}
