import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MascotaModule } from './mascota/mascota.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AdoptanteModule } from './adoptante/adoptante.module';
import { RefugioModule } from './refugio/refugio.module';
import { AdopcionModule } from './adopcion/adopcion.module';
import { VacunasModule } from './vacunas/vacunas.module';
import { HistorialModule } from './historial/historial.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST'),
        port: Number(config.get<number>('POSTGRES_PORT')),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: Number(config.get<number>('JWT_EXPIRATION')) },
      }),
    }),
    MascotaModule,
    UsuarioModule,
    AdoptanteModule,
    RefugioModule,
    AdopcionModule,
    VacunasModule,
    HistorialModule,
    FavoritosModule,
    NotificacionesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
  ],
})
export class AppModule {}

