import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './usuario.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.register({
      secret:'kiwiPotos',
      signOptions:{expiresIn:3600}
    })
  ],
  providers: [UsuarioService, JwtStrategy],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
