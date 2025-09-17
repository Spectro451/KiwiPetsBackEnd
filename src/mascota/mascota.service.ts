import { Injectable, NotFoundException } from '@nestjs/common';
import { Mascota, Estado } from './mascota.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Adopcion, EstadoAdopcion } from '../adopcion/adopcion.entity';

@Injectable()
export class MascotaService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
    @InjectRepository(Adopcion)
    private readonly adopcionRepository: Repository<Adopcion>,
  ) {}

  async findAll(): Promise<Mascota[]> {
    return this.mascotaRepository.find();
  }

  async findOne(id_mascota: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({ where: { id_mascota } });
    if (!mascota) throw new NotFoundException(`Mascota con id ${id_mascota} no encontrada`);
    return mascota;
  }

  async create(data: Partial<Mascota>): Promise<Mascota> {
    const nuevaMascota = this.mascotaRepository.create(data);
    return this.mascotaRepository.save(nuevaMascota);
  }

  async update(id_mascota: number, data: Partial<Mascota>): Promise<Mascota> {
    const mascota = await this.findOne(id_mascota);

    // Si el estado de la mascota cambia a DISPONIBLE, liberar adopciones en proceso
    if (data.estado_adopcion && data.estado_adopcion === Estado.DISPONIBLE && mascota.estado_adopcion !== Estado.DISPONIBLE) {
      const adopcionesEnProceso = await this.adopcionRepository.find({
        where: { mascota: { id_mascota }, estado: EstadoAdopcion.EN_PROCESO }
      });

      for (const adopcion of adopcionesEnProceso) {
        adopcion.estado = EstadoAdopcion.RECHAZADA; // o actualizar según la regla de negocio
        await this.adopcionRepository.save(adopcion);
      }
    }

    Object.assign(mascota, data);
    return this.mascotaRepository.save(mascota);
  }

  async remove(id_mascota: number): Promise<void> {
    const mascota = await this.findOne(id_mascota);
    await this.mascotaRepository.remove(mascota);
  }
}
