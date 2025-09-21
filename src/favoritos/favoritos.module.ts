import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';
import { Favoritos } from './favoritos.entity';
import { Mascota } from '../mascota/mascota.entity';
import { Adoptante } from '../adoptante/adoptante.entity';
import { AdoptanteModule } from 'src/adoptante/adoptante.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favoritos, Mascota, Adoptante]), AdoptanteModule],
  providers: [FavoritosService],
  controllers: [FavoritosController],
})
export class FavoritosModule {}
