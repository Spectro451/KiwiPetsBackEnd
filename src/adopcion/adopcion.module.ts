import { Module } from '@nestjs/common';
import { AdopcionService } from './adopcion.service';
import { AdopcionController } from './adopcion.controller';
import { AdopcionController } from './adopcion.controller';
import { AdopcionService } from './adopcion.service';

@Module({
  providers: [AdopcionService],
  controllers: [AdopcionController]
})
export class AdopcionModule {}
