import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
  providers: [UsuarioService],
  controllers: [UsuarioController]
})
export class UsuarioModule {}
