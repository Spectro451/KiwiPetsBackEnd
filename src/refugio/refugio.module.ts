import { Module } from '@nestjs/common';
import { RefugioService } from './refugio.service';
import { RefugioController } from './refugio.controller';
import { RefugioController } from './refugio.controller';
import { RefugioService } from './refugio.service';

@Module({
  providers: [RefugioService],
  controllers: [RefugioController]
})
export class RefugioModule {}
