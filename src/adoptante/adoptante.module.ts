import { Module } from '@nestjs/common';
import { AdoptanteService } from './adoptante.service';
import { AdoptanteController } from './adoptante.controller';
import { AdoptanteController } from './adoptante.controller';
import { AdoptanteService } from './adoptante.service';

@Module({
  providers: [AdoptanteService],
  controllers: [AdoptanteController]
})
export class AdoptanteModule {}
