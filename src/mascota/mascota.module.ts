import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotaService } from './mascota.service';
import { MascotaController } from './mascota.controller';
import { Mascota } from './mascota.entity';
import { Adopcion } from '../adopcion/adopcion.entity';
import { RefugioModule } from 'src/refugio/refugio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mascota, Adopcion]),
    RefugioModule,
  ],
  providers: [MascotaService],
  controllers: [MascotaController],
  exports:[MascotaService],
})
export class MascotaModule {}
