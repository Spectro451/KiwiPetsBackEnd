import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adopcion, EstadoAdopcion } from './adopcion.entity';
import { Mascota, Estado } from '../mascota/mascota.entity';

@Injectable()
export class AdopcionService {
  constructor(
    @InjectRepository(Adopcion)
    private readonly adopcionRepository: Repository<Adopcion>,
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  // Get todas las adopciones, incluyendo relaciones
  async findAll(): Promise<Adopcion[]> {
    return this.adopcionRepository.find({ relations: ['mascota', 'adoptante'] });
  }

  // Get adopción por id
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
    // Verificar que la mascota existe
    const mascota = await this.mascotaRepository.findOneBy({ id_mascota: data.mascota.id_mascota });
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

    // Si la mascota estaba EN_PROCESO, se permite la adopción sin cambios

    // Crear la adopción con estado EN_PROCESO
    const nuevaAdopcion = this.adopcionRepository.create({
      ...data,
      estado: EstadoAdopcion.EN_PROCESO
    });
    return this.adopcionRepository.save(nuevaAdopcion);
  }

  // Actualizar adopción
  async update(id: number, data: Partial<Adopcion>): Promise<Adopcion> {
    const adopcion = await this.findOne(id);

    // Si se cambia el estado de la adopción
    if (data.estado && data.estado !== adopcion.estado) {
      const mascota = await this.mascotaRepository.findOneBy({ id_mascota: adopcion.mascota.id_mascota });
      if (!mascota) throw new NotFoundException(`Mascota con id ${adopcion.mascota.id_mascota} no encontrada`);

      // Reglas de actualización:
      // - ACEPTADA → mascota pasa a ADOPTADO
      // - RECHAZADA → mascota vuelve a DISPONIBLE
      if (data.estado === EstadoAdopcion.ACEPTADA) mascota.estado_adopcion = Estado.ADOPTADO;
      if (data.estado === EstadoAdopcion.RECHAZADA) mascota.estado_adopcion = Estado.DISPONIBLE;

      await this.mascotaRepository.save(mascota);
    }

    // Actualizar adopción con los nuevos datos
    Object.assign(adopcion, data);
    return this.adopcionRepository.save(adopcion);
  }

  // Eliminar adopción
  async remove(id: number): Promise<void> {
    const adopcion = await this.findOne(id);

    // Si estaba en proceso, liberar la mascota (solo si no fue adoptada)
    if (adopcion.estado === EstadoAdopcion.EN_PROCESO) {
      const mascota = await this.mascotaRepository.findOneBy({ id_mascota: adopcion.mascota.id_mascota });
      if (mascota && mascota.estado_adopcion !== Estado.ADOPTADO) {
        mascota.estado_adopcion = Estado.DISPONIBLE;
        await this.mascotaRepository.save(mascota);
      }
    }

    // Eliminar adopción
    await this.adopcionRepository.remove(adopcion);
  }
}
