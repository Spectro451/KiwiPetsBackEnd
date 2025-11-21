import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotaService } from './mascota.service';
import { MascotaController } from './mascota.controller';
import { Mascota } from './mascota.entity';
import { Adopcion } from '../adopcion/adopcion.entity';
import { Notificaciones } from '../notificaciones/notificaciones.entity';
import { Refugio } from '../refugio/refugio.entity';
import { RefugioModule } from 'src/refugio/refugio.module';
import { AdoptanteModule } from 'src/adoptante/adoptante.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mascota, Adopcion, Notificaciones, Refugio]),
    RefugioModule,
    AdoptanteModule,
  ],
  providers: [MascotaService],
  controllers: [MascotaController],
  exports: [MascotaService],
})
export class MascotaModule {}
