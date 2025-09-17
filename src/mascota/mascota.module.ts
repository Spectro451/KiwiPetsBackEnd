import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotaService } from './mascota.service';
import { MascotaController } from './mascota.controller';
import { Mascota } from './mascota.entity';
import { Adopcion } from '../adopcion/adopcion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mascota, Adopcion])],
  providers: [MascotaService],
  controllers: [MascotaController],
})
export class MascotaModule {}
