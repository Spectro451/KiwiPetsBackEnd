// src/seed.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario, TipoUsuario } from './usuario/usuario.entity';
import { Refugio } from './refugio/refugio.entity';
import { Adoptante, EspeciePreferida, Sexo, Edad, Vivienda } from './adoptante/adoptante.entity';
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

  // -----------------------
  // Datos seed: 5 entidades distintas por tabla (sin repetir)
  // -----------------------
  // (Asegúrate de pegar esto donde ya existen: refugios[], adoptantes[], mascotas[])

  // --- Refugios (5 distintos) ---
  const refugiosData = [
    { correo: 'refugio.aurora@seed.local', nombre: 'Aurora', direccion: 'Calle Aurora 12', telefono: '+56970000001', email: 'aurora@refugio.local', validado: true },
    { correo: 'refugio.bosque@seed.local', nombre: 'Bosque', direccion: 'Av. Bosque 45', telefono: '+56970000002', email: 'bosque@refugio.local', validado: true },
    { correo: 'refugio.cerezo@seed.local', nombre: 'Cerezo', direccion: 'Pasaje Cerezo 7', telefono: '+56970000003', email: 'cerezo@refugio.local', validado: true },
    { correo: 'refugio.dunas@seed.local', nombre: 'Dunas', direccion: 'Camino Dunas 101', telefono: '+56970000004', email: 'dunas@refugio.local', validado: true },
    { correo: 'refugio.estrella@seed.local', nombre: 'Estrella', direccion: 'Plaza Estrella 3', telefono: '+56970000005', email: 'estrella@refugio.local', validado: true },
  ];

  for (let i = 0; i < refugiosData.length; i++) {
    const usuarioRef = await usuarioRepo.save(usuarioRepo.create({
      tipo: TipoUsuario.REFUGIO,
      correo: refugiosData[i].correo,
      contraseña: `refugio-pass-${i + 1}`,
      admin: false,
    }));

    const r = await refugioRepo.save(refugioRepo.create({
      nombre: refugiosData[i].nombre,
      direccion: refugiosData[i].direccion,
      telefono: refugiosData[i].telefono,
      validado: refugiosData[i].validado,
      usuario: usuarioRef,
    }));
    refugios.push(r);
  }
  console.log(`→ Refugios creados: ${refugios.length}`);

  // --- Adoptantes (5 distintos) ---
  const adoptantesData = [
    { correo: 'ana.seed@seed.local', rut: '11111111-1', nombre: 'Ana Seed', edad: 28, telefono: '+56980000001', direccion: 'Calle A 1', cantidad_mascotas: 0, motivo: 'Compañía' },
    { correo: 'bruno.seed@seed.local', rut: '22222222-2', nombre: 'Bruno Seed', edad: 35, telefono: '+56980000002', direccion: 'Calle B 2', cantidad_mascotas: 1, motivo: 'Familia' },
    { correo: 'carla.seed@seed.local', rut: '33333333-3', nombre: 'Carla Seed', edad: 22, telefono: '+56980000003', direccion: 'Calle C 3', cantidad_mascotas: 0, motivo: 'Responsabilidad' },
    { correo: 'daniel.seed@seed.local', rut: '44444444-4', nombre: 'Daniel Seed', edad: 41, telefono: '+56980000004', direccion: 'Calle D 4', cantidad_mascotas: 2, motivo: 'Protección animal' },
    { correo: 'elena.seed@seed.local', rut: '55555555-5', nombre: 'Elena Seed', edad: 30, telefono: '+56980000005', direccion: 'Calle E 5', cantidad_mascotas: 0, motivo: 'Compañía' },
  ];

  for (let i = 0; i < adoptantesData.length; i++) {
    const usuarioAd = await usuarioRepo.save(usuarioRepo.create({
      tipo: TipoUsuario.ADOPTANTE,
      correo: adoptantesData[i].correo,
      contraseña: `adoptante-pass-${i + 1}`,
      admin: false,
    }));

    const a = await adoptanteRepo.save(adoptanteRepo.create({
      rut: adoptantesData[i].rut,
      nombre: adoptantesData[i].nombre,
      edad: adoptantesData[i].edad,
      telefono: adoptantesData[i].telefono,
      direccion: adoptantesData[i].direccion,
      cantidad_mascotas: adoptantesData[i].cantidad_mascotas,
      especie_preferida: EspeciePreferida.PERRO,
      tipo_vivienda: Vivienda.CASA_PATIO,
      sexo: Sexo.CUALQUIERA,
      edad_buscada: Edad.ADULTO,
      motivo_adopcion: adoptantesData[i].motivo,
      usuario: usuarioAd,
    }));
    adoptantes.push(a);
  }
  console.log(`→ Adoptantes creados: ${adoptantes.length}`);

  // --- Mascotas (5 distintas), cada una con vacunas e historial distintos ---
  const mascotasSeed = [
    {
      nombre: "Fido",
      raza: "Labrador",
      edad: 5,
      tamaño: Tamaño.GRANDE,
      especie: EspecieMascota.PERRO,
      genero: Genero.MASCULINO,
      vacunado: true,
      esterilizado: true,
      posee_descendencia: false,
      veces_adoptado: 2,
      fecha_ingreso: new Date("2025-08-18"),
      discapacidad: false,
      descripcion: "Perro amigable y activo, le encanta jugar con niños.",
      personalidad: "Alegre, cariñoso, sociable",
      foto: "https://example.com/fido.jpg",
      requisito_adopcion: "Hogar con jardín y personas activas",
      estado_adopcion: EstadoMascota.DISPONIBLE,
      refugioIndex: 0,
      chip: null,
      vacunas: [
        { nombre: "Rabia", fecha_aplicacion: new Date("2024-12-01"), proxima_dosis: new Date("2025-12-01"), observaciones: "Aplicada correctamente" },
        { nombre: "Moquillo", fecha_aplicacion: new Date("2024-12-15"), proxima_dosis: new Date("2025-12-15"), observaciones: "Sin reacciones adversas" },
        { nombre: "Parvovirus", fecha_aplicacion: new Date("2025-01-10"), proxima_dosis: new Date("2026-01-10"), observaciones: "Refuerzo anual requerido" },
      ],
      historial: [
        { fecha: new Date("2025-06-01"), descripcion: "Chequeo general, todo normal", veterinario: "Dr. Juan Pérez", tratamiento: "Ninguno" },
        { fecha: new Date("2025-07-15"), descripcion: "Ligero resfriado, medicación administrada", veterinario: "Dra. Ana Gómez", tratamiento: "Jarabe antibiótico 5 días" },
      ],
    },
    {
      nombre: "Mila",
      raza: "Persa",
      edad: 3,
      tamaño: Tamaño.MEDIANO,
      especie: EspecieMascota.GATO,
      genero: Genero.FEMENINO,
      vacunado: true,
      esterilizado: true,
      posee_descendencia: false,
      veces_adoptado: 1,
      fecha_ingreso: new Date("2025-07-10"),
      discapacidad: false,
      descripcion: "Gata tranquila y cariñosa, ideal para departamentos.",
      personalidad: "Afectuosa, independiente",
      foto: "https://example.com/mila.jpg",
      requisito_adopcion: "Hogar sin perros grandes",
      estado_adopcion: EstadoMascota.DISPONIBLE,
      refugioIndex: 1,
      chip: "CHIP12345",
      vacunas: [
        { nombre: "Rabia", fecha_aplicacion: new Date("2024-11-01"), proxima_dosis: new Date("2025-11-01"), observaciones: "Sin problemas" },
        { nombre: "Leucemia felina", fecha_aplicacion: new Date("2025-01-05"), proxima_dosis: new Date("2026-01-05"), observaciones: "Vacuna anual" },
      ],
      historial: [
        { fecha: new Date("2025-06-20"), descripcion: "Revisión dental", veterinario: "Dr. Carlos Méndez", tratamiento: "Limpieza realizada" },
      ],
    },
    {
      nombre: "Toby",
      raza: "Beagle",
      edad: 2,
      tamaño: Tamaño.MEDIANO,
      especie: EspecieMascota.PERRO,
      genero: Genero.MASCULINO,
      vacunado: true,
      esterilizado: false,
      posee_descendencia: false,
      veces_adoptado: 0,
      fecha_ingreso: new Date("2025-05-25"),
      discapacidad: false,
      descripcion: "Perro curioso y juguetón, perfecto para familias.",
      personalidad: "Activo, sociable, inteligente",
      foto: "https://example.com/toby.jpg",
      requisito_adopcion: "Familia con patio",
      estado_adopcion: EstadoMascota.DISPONIBLE,
      refugioIndex: 2,
      chip: "CHIPpoto12345",
      vacunas: [
        { nombre: "Rabia", fecha_aplicacion: new Date("2025-01-12"), proxima_dosis: new Date("2026-01-12"), observaciones: "Aplicada correctamente" },
      ],
      historial: [
        { fecha: new Date("2025-06-15"), descripcion: "Chequeo general", veterinario: "Dra. Laura Rojas", tratamiento: "Ninguno" },
      ],
    },
    {
      nombre: "Luna",
      raza: "Siamés",
      edad: 4,
      tamaño: Tamaño.MEDIANO,
      especie: EspecieMascota.GATO,
      genero: Genero.FEMENINO,
      vacunado: true,
      esterilizado: true,
      posee_descendencia: false,
      veces_adoptado: 1,
      fecha_ingreso: new Date("2025-03-12"),
      discapacidad: false,
      descripcion: "Gata juguetona y curiosa, ideal para niños.",
      personalidad: "Juguetona, cariñosa",
      foto: "https://example.com/luna.jpg",
      requisito_adopcion: "Hogar con niños",
      estado_adopcion: EstadoMascota.DISPONIBLE,
      refugioIndex: 3,
      chip: "peo",
      vacunas: [
        { nombre: "Rabia", fecha_aplicacion: new Date("2024-10-01"), proxima_dosis: new Date("2025-10-01"), observaciones: "Aplicada correctamente" },
      ],
      historial: [
        { fecha: new Date("2025-04-01"), descripcion: "Chequeo general", veterinario: "Dr. Pedro López", tratamiento: "Ninguno" },
      ],
    },
    {
      nombre: "Max",
      raza: "Bulldog",
      edad: 6,
      tamaño: Tamaño.GRANDE,
      especie: EspecieMascota.PERRO,
      genero: Genero.MASCULINO,
      vacunado: true,
      esterilizado: true,
      posee_descendencia: false,
      veces_adoptado: 3,
      fecha_ingreso: new Date("2025-02-18"),
      discapacidad: false,
      descripcion: "Perro tranquilo, ideal para hogares con menos actividad.",
      personalidad: "Calmado, afectuoso",
      foto: "https://example.com/max.jpg",
      requisito_adopcion: "Hogar tranquilo",
      estado_adopcion: EstadoMascota.DISPONIBLE,
      refugioIndex: 4,
      vacunas: [
        { nombre: "Rabia", fecha_aplicacion: new Date("2024-11-20"), proxima_dosis: new Date("2025-11-20"), observaciones: "Aplicada correctamente" },
      ],
      historial: [
        { fecha: new Date("2025-03-01"), descripcion: "Chequeo general", veterinario: "Dra. Camila Torres", tratamiento: "Ninguno" },
      ],
    },
  ];

  for (let i = 0; i < mascotasSeed.length; i++) {
    const md = mascotasSeed[i];
    const mascota = await mascotaRepo.save(mascotaRepo.create({
      nombre: md.nombre,
      raza: md.raza,
      edad: md.edad,
      tamaño: md.tamaño,
      especie: md.especie,
      genero: md.genero,
      vacunado: md.vacunado,
      esterilizado: md.esterilizado,
      posee_descendencia: md.posee_descendencia,
      veces_adoptado: md.veces_adoptado,
      fecha_ingreso: md.fecha_ingreso,
      discapacidad: md.discapacidad,
      descripcion: md.descripcion,
      personalidad: md.personalidad,
      foto: md.foto,
      requisito_adopcion: md.requisito_adopcion,
      estado_adopcion: md.estado_adopcion,
      chip: md.chip ?? null,
      refugio: refugios[md.refugioIndex],
    }));
    mascotas.push(mascota);

    // Vacunas (únicas por mascota)
    for (const v of md.vacunas) {
      await vacunasRepo.save(vacunasRepo.create({
        nombre: v.nombre,
        fecha_aplicacion: v.fecha_aplicacion,
        proxima_dosis: v.proxima_dosis ?? null,
        observaciones: v.observaciones ?? null,
        mascota,
      }));
    }

    // Historial clínico (único por mascota)
    for (const h of md.historial) {
      await historialRepo.save(historialRepo.create({
        fecha: h.fecha,
        descripcion: h.descripcion,
        veterinario: h.veterinario,
        tratamiento: h.tratamiento ?? null,
        mascota,
      }));
    }
  }
  console.log(`→ Mascotas creadas: ${mascotas.length} (con vacunas e historial únicos)`);

  // --- Favoritos: 5 pares únicos (sin repetir) ---
  const favoritosPairs = [
    { adoptanteIndex: 0, mascotaIndex: 1 },
    { adoptanteIndex: 1, mascotaIndex: 2 },
    { adoptanteIndex: 2, mascotaIndex: 3 },
    { adoptanteIndex: 3, mascotaIndex: 4 },
    { adoptanteIndex: 4, mascotaIndex: 0 },
  ];
  for (const p of favoritosPairs) {
    await favoritosRepo.save(favoritosRepo.create({
      adoptante: adoptantes[p.adoptanteIndex],
      mascota: mascotas[p.mascotaIndex],
    }));
  }
  console.log('→ Favoritos creados (pares únicos)');

  // --- Notificaciones: 5 distintas dirigidas a distintos usuarios ---
  const allUsuarios = await usuarioRepo.find();
  const notis = [
    { mensaje: 'Bienvenido — completa tu perfil para postular a adopciones.', leido: false, usuario: allUsuarios[0 % allUsuarios.length] },
    { mensaje: 'Nueva solicitud de adopción para una de tus mascotas.', leido: false, usuario: allUsuarios[1 % allUsuarios.length] },
    { mensaje: 'Recordatorio de control veterinario.', leido: false, usuario: allUsuarios[2 % allUsuarios.length] },
    { mensaje: 'Tu solicitud fue recibida y está en proceso.', leido: false, usuario: allUsuarios[3 % allUsuarios.length] },
    { mensaje: 'Evento de adopción este fin de semana — confirma asistencia.', leido: false, usuario: allUsuarios[4 % allUsuarios.length] },
  ];
  for (const n of notis) {
    await notiRepo.save(notiRepo.create({
      mensaje: n.mensaje,
      leido: n.leido,
      fecha: new Date(),
      usuario: n.usuario,
    }));
  }
  console.log('→ Notificaciones creadas');

  // --- Adopciones: 5 entradas distintas (adoptante -> mascota), fechas variadas ---
  // Uso EstadoAdopcion.EN_PROCESO (ajusta si tu enum tiene otros valores)
  const adopcionesSeed = [
    { adoptante: adoptantes[0], mascota: mascotas[0], fecha_solicitud: new Date("2025-09-01"), estado: EstadoAdopcion.EN_PROCESO },
    { adoptante: adoptantes[1], mascota: mascotas[1], fecha_solicitud: new Date("2025-08-20"), estado: EstadoAdopcion.EN_PROCESO },
    { adoptante: adoptantes[2], mascota: mascotas[2], fecha_solicitud: new Date("2025-07-10"), estado: EstadoAdopcion.EN_PROCESO },
    { adoptante: adoptantes[3], mascota: mascotas[3], fecha_solicitud: new Date("2025-06-25"), estado: EstadoAdopcion.EN_PROCESO },
    { adoptante: adoptantes[4], mascota: mascotas[4], fecha_solicitud: new Date("2025-05-30"), estado: EstadoAdopcion.EN_PROCESO },
  ];

  for (const ad of adopcionesSeed) {
    // Asegurarnos de tener la mascota con la relación refugio cargada (por si el objeto en memoria no incluye relaciones)
    const mascotaConRefugio = await mascotaRepo.findOne({
      where: { id_mascota: ad.mascota.id_mascota },
      relations: ['refugio'],
    });

    if (!mascotaConRefugio) {
      throw new Error(`Seed: mascota con id ${ad.mascota.id_mascota} no encontrada al crear adopcion`);
    }
    if (!mascotaConRefugio.refugio) {
      throw new Error(`Seed: la mascota id ${ad.mascota.id_mascota} no tiene refugio asociado`);
    }

    await adopcionRepo.save(adopcionRepo.create({
      adoptante: ad.adoptante,
      mascota: mascotaConRefugio,
      refugio: mascotaConRefugio.refugio,    // <<-- asignamos el refugio obligatorio
      fecha_solicitud: ad.fecha_solicitud,
      estado: ad.estado,
    }));
  }
  console.log('→ Adopciones creadas (entradas únicas)');


  console.log('✅ Seed completado correctamente.');
  await AppDataSource.destroy();
}

runSeed().catch((err) => {
  console.error('ERROR en seed:', err);
  process.exit(1);
});
