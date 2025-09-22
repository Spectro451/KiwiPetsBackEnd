import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdopcionService } from './adopcion.service';
import { AdopcionController } from './adopcion.controller';
import { Adopcion } from './adopcion.entity';
import { Mascota } from '../mascota/mascota.entity';
import { Adoptante } from '../adoptante/adoptante.entity';
import { RefugioModule } from 'src/refugio/refugio.module';
import { AdoptanteModule } from 'src/adoptante/adoptante.module';
import { NotificacionesModule } from 'src/notificaciones/notificaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adopcion, Mascota, Adoptante]),
    RefugioModule,
    AdoptanteModule,
    NotificacionesModule,
  ],
  providers: [AdopcionService],
  controllers: [AdopcionController],
})
export class AdopcionModule {}
