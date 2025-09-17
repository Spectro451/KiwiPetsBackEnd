import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefugioService } from './refugio.service';
import { RefugioController } from './refugio.controller';
import { Refugio } from './refugio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Refugio])],
  providers: [RefugioService],
  controllers: [RefugioController],
})
export class RefugioModule {}
