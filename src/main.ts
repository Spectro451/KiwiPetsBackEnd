import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AccesoTotal } from './auth/pruebas.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  //acuerdate de borrarlo xd
  app.useGlobalGuards(app.get(AccesoTotal));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
