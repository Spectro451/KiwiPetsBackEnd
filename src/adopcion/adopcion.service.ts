import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Adopcion, EstadoAdopcion } from './adopcion.entity';
import { Mascota, Estado } from '../mascota/mascota.entity';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';

@Injectable()
export class AdopcionService {
  constructor(
    @InjectRepository(Adopcion)
    private readonly adopcionRepository: Repository<Adopcion>,
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
    private readonly notificacionesService:NotificacionesService,
  ) {}

  // Getall
  async findAll(): Promise<Adopcion[]> {
    return this.adopcionRepository.find({
      relations: ['mascota', 'mascota.refugio', 'adoptante'],
    });
  }

  // GetId
  async findOne(id: number): Promise<Adopcion> {
    const adopcion = await this.adopcionRepository.findOne({
      where: { id },
      relations: ['mascota', 'adoptante']
    });
    if (!adopcion) throw new NotFoundException(`Adopcion con id ${id} no encontrada`);
    return adopcion;
  }

  // Crear nueva adopción
  async create(data: Partial<Adopcion>): Promise<Adopcion> {
    if (!data.mascota || !data.mascota.id_mascota) {
      throw new BadRequestException('Debe proporcionar una mascota válida para la adopción');
    }
    if (!data.adoptante) {
      throw new BadRequestException('Debe proporcionar un adoptante válido para la adopción');
    }
    const existing = await this.adopcionRepository.findOne({
      where: {
        adoptante: { rut: data.adoptante.rut },
        mascota: { id_mascota: data.mascota.id_mascota },
        estado: EstadoAdopcion.EN_PROCESO
      }
    });

    if (existing) {
      // si ya habia adopcion no hace nada xd
      return existing;
    }
    // Verificar que la mascota existe
      const mascota = await this.mascotaRepository.findOne({
        where: { id_mascota: data.mascota.id_mascota },
        relations: ['refugio'],
      });
    if (!mascota) throw new NotFoundException(`Mascota con id ${data.mascota.id_mascota} no encontrada`);

    // Verificar que la mascota no está adoptada
    if (mascota.estado_adopcion === Estado.ADOPTADO) {
      throw new BadRequestException('La mascota ya ha sido adoptada');
    }

    // Si la mascota estaba DISPONIBLE, la ponemos EN_PROCESO
    if (mascota.estado_adopcion === Estado.DISPONIBLE) {
      mascota.estado_adopcion = Estado.EN_PROCESO;
      await this.mascotaRepository.save(mascota);
    }

    // Crear la adopción con estado EN_PROCESO
    const nuevaAdopcion = this.adopcionRepository.create({
      ...data,
      mascota,
      refugio: mascota.refugio,
      fecha_solicitud: new Date(),
      estado: EstadoAdopcion.EN_PROCESO,
    });
    const savedAdopcion = await this.adopcionRepository.save(nuevaAdopcion);

    // Crear notificación para el refugio
    await this.notificacionesService.create({
      usuario: mascota.refugio.usuario,
      mensaje: `${data.adoptante.nombre} quiere adoptar a ${mascota.nombre}`,
      fecha: new Date(),
    });

    return savedAdopcion;
  }

  //Update
  async update(id: number, data: Partial<Adopcion>): Promise<Adopcion> {
    const adopcion = await this.findOne(id);

    // Si se cambia el estado de la adopción
    if (data.estado && data.estado !== adopcion.estado) {
      const mascota = await this.mascotaRepository.findOneBy({ id_mascota: adopcion.mascota.id_mascota });
      if (!mascota) throw new NotFoundException(`Mascota con id ${adopcion.mascota.id_mascota} no encontrada`);

      // Reglas de actualización:
      if (data.estado === EstadoAdopcion.ACEPTADA) {
        // La mascota pasa a ADOPTADO
        mascota.estado_adopcion = Estado.ADOPTADO;
        await this.mascotaRepository.save(mascota);

        // Rechazar todas las demás adopciones en proceso
        const otrasAdopciones = await this.adopcionRepository.find({
          where: { mascota: { id_mascota: mascota.id_mascota }, estado: EstadoAdopcion.EN_PROCESO }
        });

        for (const otra of otrasAdopciones) {
          if (otra.id !== adopcion.id) {
            otra.estado = EstadoAdopcion.RECHAZADA;
            await this.adopcionRepository.save(otra);
          }
        }
      }

      if (data.estado === EstadoAdopcion.RECHAZADA) {
        // La mascota vuelve a DISPONIBLE
        mascota.estado_adopcion = Estado.DISPONIBLE;
        await this.mascotaRepository.save(mascota);
      }
    }

    // Actualizar adopción con los nuevos datos
    Object.assign(adopcion, data);
    const updatedAdopcion = await this.adopcionRepository.save(adopcion);

    // Crear notificación para el adoptante
    if (data.estado === EstadoAdopcion.ACEPTADA) {
      await this.notificacionesService.create({
        usuario: adopcion.adoptante.usuario,
        mensaje: `¡Felicidades! La adopción de ${adopcion.mascota.nombre} fue aceptada.`,
        fecha: new Date(),
      });
    } else if (data.estado === EstadoAdopcion.RECHAZADA) {
      await this.notificacionesService.create({
        usuario: adopcion.adoptante.usuario,
        mensaje: `Lo sentimos. La adopción de ${adopcion.mascota.nombre} fue rechazada.`,
        fecha: new Date(),
      });
    }

    return updatedAdopcion;
  }


  // Delete
  async remove(id: number): Promise<void> {
    const adopcion = await this.findOne(id);

    // Si estaba en proceso, dejar mascota como disponible
    if (adopcion.estado === EstadoAdopcion.EN_PROCESO) {
      const mascota = await this.mascotaRepository.findOneBy({ id_mascota: adopcion.mascota.id_mascota });
      if (mascota && mascota.estado_adopcion !== Estado.ADOPTADO) {
        // Verificar si hay otras adopciones EN_PROCESO para la misma mascota
        const otrasEnProceso = await this.adopcionRepository.count({
          where: { mascota: { id_mascota: mascota.id_mascota }, estado: EstadoAdopcion.EN_PROCESO, id: Not(adopcion.id) }
        });
        if (otrasEnProceso === 0) {
          mascota.estado_adopcion = Estado.DISPONIBLE;
          await this.mascotaRepository.save(mascota);
        }
      }
    }
    await this.adopcionRepository.delete(id);
  }

  //busca por refugio
  async findByRefugio(refugioId: number): Promise<Adopcion[]> {
    return this.adopcionRepository.find({
      where: { refugio: { id: refugioId } },
      relations: ['mascota', 'adoptante'],
    });
  }

  async findByAdoptante(adoptanteRut: string): Promise<Adopcion[]> {
    return this.adopcionRepository.find({
      where: { adoptante: { rut: adoptanteRut } },
      relations: ['mascota', 'mascota.refugio'],
    });
  }
}
