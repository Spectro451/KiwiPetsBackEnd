import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MascotaModule } from './mascota/mascota.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AdoptanteModule } from './adoptante/adoptante.module';
import { RefugioModule } from './refugio/refugio.module';
import { AdopcionModule } from './adopcion/adopcion.module';
import { VacunasModule } from './vacunas/vacunas.module';
import { HistorialModule } from './historial/historial.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:'localhost',
      port:5432,
      username:'postgres',
      password:'0403',
      database:'kiwiPets',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize:true,
    }),
    MascotaModule,
    UsuarioModule,
    AdoptanteModule,
    RefugioModule,
    AdopcionModule,
    VacunasModule,
    HistorialModule,
    FavoritosModule,
    NotificacionesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass:RolesGuard,
    }
  ],
})
export class AppModule {}

