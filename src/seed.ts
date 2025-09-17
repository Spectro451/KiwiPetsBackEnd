// src/seed.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario, TipoUsuario } from './usuario/usuario.entity';
import { Refugio } from './refugio/refugio.entity';
import { Adoptante, Especie, Sexo, Edad, Vivienda } from './adoptante/adoptante.entity';
import { Mascota, Tamaño, Especie as EspecieMascota, Genero, Estado as EstadoMascota } from './mascota/mascota.entity';
import { Vacunas } from './vacunas/vacunas.entity';
import { Historial } from './historial/historial.entity';
import { Favoritos } from './favoritos/favoritos.entity';
import { Notificaciones } from './notificaciones/notificaciones.entity';
import { Adopcion, EstadoAdopcion } from './adopcion/adopcion.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '0403',
  database: 'kiwiPets',
  synchronize: true,
  logging: false,
  entities: [Usuario, Refugio, Adoptante, Mascota, Vacunas, Historial, Favoritos, Notificaciones, Adopcion],
});

async function runSeed() {
  await AppDataSource.initialize();
  console.log('→ Conectado a la DB para seed');

  // Repositorios
  const usuarioRepo = AppDataSource.getRepository(Usuario);
  const refugioRepo = AppDataSource.getRepository(Refugio);
  const adoptanteRepo = AppDataSource.getRepository(Adoptante);
  const mascotaRepo = AppDataSource.getRepository(Mascota);
  const vacunasRepo = AppDataSource.getRepository(Vacunas);
  const historialRepo = AppDataSource.getRepository(Historial);
  const favoritosRepo = AppDataSource.getRepository(Favoritos);
  const notiRepo = AppDataSource.getRepository(Notificaciones);
  const adopcionRepo = AppDataSource.getRepository(Adopcion);

  // --- Limpiar tablas con CASCADE ---
  await AppDataSource.query(`
    TRUNCATE TABLE "adopcion", "favoritos", "notificaciones", "vacunas", "historial", "mascota", "refugio", "adoptante", "usuario" CASCADE
  `);
  console.log('→ Tablas truncadas (CASCADE)');

  const refugios: Refugio[] = [];
  const adoptantes: Adoptante[] = [];
  const mascotas: Mascota[] = [];

  // 1) Crear 5 refugios
  for (let i = 1; i <= 5; i++) {
    const usuario = await usuarioRepo.save(usuarioRepo.create({
      tipo: TipoUsuario.REFUGIO,
      correo: `refugio${i}@seed.local`,
      contraseña: `refugio-pass-${i}`,
      admin: false,
    }));

    const refugio = await refugioRepo.save(refugioRepo.create({
      nombre: `Refugio Seed ${i}`,
      direccion: `Calle Seed ${i}`,
      telefono: `+5690000000${i}`,
      email: `contacto${i}@refugio.local`,
      validado: true,
      usuario,
    }));
    refugios.push(refugio);
  }
  console.log(`→ Refugios creados: ${refugios.length}`);

  // 2) Crear 5 adoptantes
  for (let i = 1; i <= 5; i++) {
    const usuario = await usuarioRepo.save(usuarioRepo.create({
      tipo: TipoUsuario.ADOPTANTE,
      correo: `adoptante${i}@seed.local`,
      contraseña: `adoptante-pass-${i}`,
      admin: false,
    }));

    const adoptante = await adoptanteRepo.save(adoptanteRepo.create({
      rut: `1000000${i}-A`,
      nombre: `Adoptante Seed ${i}`,
      edad: 20 + i,
      telefono: `+5691000000${i}`,
      direccion: `Av Seed ${i}`,
      cantidad_mascotas: i % 2,
      especie_preferida: Especie.PERRO,
      tipo_vivienda: Vivienda.CASA_PATIO,
      sexo: Sexo.CUALQUIERA,
      edad_buscada: Edad.ADULTO,
      motivo_adopcion: `Motivo seed ${i}`,
      usuario,
    }));
    adoptantes.push(adoptante);
  }
  console.log(`→ Adoptantes creados: ${adoptantes.length}`);

  // 3) Crear 5 mascotas
  for (let i = 0; i < refugios.length; i++) {
    const mascota = await mascotaRepo.save(mascotaRepo.create({
      nombre: `Mascota Seed ${i + 1}`,
      raza: `Raza ${i + 1}`,
      edad: 1 + i,
      tamaño: Tamaño.GRANDE,
      especie: i % 2 === 0 ? EspecieMascota.PERRO : EspecieMascota.GATO,
      genero: i % 2 === 0 ? Genero.MASCULINO : Genero.FEMENINO,
      vacunado: true,
      esterilizado: i % 2 === 0,
      posee_descendencia: false,
      veces_adoptado: 0,
      fecha_ingreso: new Date(),
      discapacidad: false,
      descripcion: `Descripción seed ${i + 1}`,
      personalidad: `Personalidad seed ${i + 1}`,
      foto: null,
      requisito_adopcion: 'Hogar responsable',
      estado_adopcion: EstadoMascota.DISPONIBLE,
      refugio: refugios[i],
    }));
    mascotas.push(mascota);
  }
  console.log(`→ Mascotas creadas: ${mascotas.length}`);

  // 4) Vacunas
  for (let i = 0; i < mascotas.length; i++) {
    await vacunasRepo.save(vacunasRepo.create({
      nombre: `Vacuna Seed ${i + 1}`,
      fecha_aplicacion: new Date(),
      mascota: mascotas[i],
    }));
  }
  console.log('→ Vacunas creadas');

  // 5) Historial
  for (let i = 0; i < mascotas.length; i++) {
    await historialRepo.save(historialRepo.create({
      descripcion: `Historial seed ${i + 1}`,
      fecha: new Date(),
      mascota: mascotas[i],
    }));
  }
  console.log('→ Historiales creados');

  // 6) Favoritos (adoptante i -> mascota i)
  for (let i = 0; i < 5; i++) {
    await favoritosRepo.save(favoritosRepo.create({
      adoptante: adoptantes[i],
      mascota: mascotas[i],
    }));
  }
  console.log('→ Favoritos creados');

  // 7) Notificaciones
  const allUsuarios = await usuarioRepo.find();
  for (let i = 0; i < 5; i++) {
    await notiRepo.save(notiRepo.create({
      mensaje: `Mensaje de prueba ${i + 1}`,
      leido: false,
      fecha: new Date(),
      usuario: allUsuarios[i % allUsuarios.length],
    }));
  }
  console.log('→ Notificaciones creadas');

  // 8) Adopciones (adoptante i -> mascota i)
  for (let i = 0; i < 5; i++) {
    await adopcionRepo.save(adopcionRepo.create({
      adoptante: adoptantes[i],
      mascota: mascotas[i],
      fecha_solicitud: new Date(),
      estado: EstadoAdopcion.EN_PROCESO,
    }));
  }
  console.log('→ Adopciones creadas');

  console.log('✅ Seed completado correctamente.');
  await AppDataSource.destroy();
}

runSeed().catch((err) => {
  console.error('ERROR en seed:', err);
  process.exit(1);
});
