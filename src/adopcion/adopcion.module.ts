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
import { Usuario } from 'src/usuario/usuario.entity';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import { Notificaciones } from 'src/notificaciones/notificaciones.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adopcion, Mascota, Adoptante, Usuario, Notificaciones]),
    RefugioModule,
    AdoptanteModule,
    NotificacionesModule,
  ],
  providers: [AdopcionService, NotificacionesService],
  controllers: [AdopcionController],
})
export class AdopcionModule {}
