import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MascotaModule } from './mascota/mascota.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AdoptanteModule } from './adoptante/adoptante.module';
import { RefugioModule } from './refugio/refugio.module';
import { AdopcionModule } from './adopcion/adopcion.module';
import { VacunasModule } from './vacunas/vacunas.module';
import { HistorialClinicoModule } from './historial/historial.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';

@Module({
  imports: [MascotaModule, UsuarioModule, AdoptanteModule, RefugioModule, AdopcionModule, VacunasModule, HistorialClinicoModule, FavoritosModule, NotificacionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
