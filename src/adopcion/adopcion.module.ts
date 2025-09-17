import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdopcionService } from './adopcion.service';
import { AdopcionController } from './adopcion.controller';
import { Adopcion } from './adopcion.entity';
import { Mascota } from '../mascota/mascota.entity';
import { Adoptante } from '../adoptante/adoptante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Adopcion, Mascota, Adoptante])],
  providers: [AdopcionService],
  controllers: [AdopcionController],
})
export class AdopcionModule {}
