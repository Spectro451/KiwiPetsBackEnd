import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptanteService } from './adoptante.service';
import { AdoptanteController } from './adoptante.controller';
import { Adoptante } from './adoptante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Adoptante])],
  providers: [AdoptanteService],
  controllers: [AdoptanteController],
})
export class AdoptanteModule {}
