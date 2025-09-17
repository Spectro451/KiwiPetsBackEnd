import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { Notificaciones } from './notificaciones.entity';
import { Usuario } from '../usuario/usuario.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Notificaciones, Usuario]) 
  ],
  providers: [NotificacionesService],
  controllers: [NotificacionesController],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
