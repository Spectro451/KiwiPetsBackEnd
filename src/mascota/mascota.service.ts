import { Injectable, NotFoundException } from '@nestjs/common';
import { Mascota, Estado } from './mascota.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Adopcion, EstadoAdopcion } from '../adopcion/adopcion.entity';
import { Refugio } from 'src/refugio/refugio.entity';

@Injectable()
export class MascotaService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
    @InjectRepository(Adopcion)
    private readonly adopcionRepository: Repository<Adopcion>,
  ) {}

  async findAll(): Promise<Mascota[]> {
    return this.mascotaRepository.find({
      relations: ["vacunas", "historialClinico","refugio","refugio.usuario"],
    });
  }

  async findOne(id_mascota: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({ where: { id_mascota }, relations: ["vacunas", "historialClinico","refugio", "refugio.usuario"] });
    if (!mascota) throw new NotFoundException(`Mascota con id ${id_mascota} no encontrada`);
    return mascota;
  }

  async create(data: Partial<Mascota>): Promise<Mascota> {
    const nuevaMascota = this.mascotaRepository.create(data);
    return this.mascotaRepository.save(nuevaMascota);
  }

  async update(id_mascota: number, data: Partial<Mascota>): Promise<Mascota> {
    const mascota = await this.findOne(id_mascota);

    // Cambio de estado desde mascota sobre adopciones
    if (data.estado_adopcion && data.estado_adopcion !== mascota.estado_adopcion) {
      if (data.estado_adopcion === Estado.DISPONIBLE) {
        // Si vuelve a DISPONIBLE → todas las adopciones en proceso quedan RECHAZADAS
        const adopcionesEnProceso = await this.adopcionRepository.find({
          where: { mascota: { id_mascota }, estado: EstadoAdopcion.EN_PROCESO }
        });

        for (const adopcion of adopcionesEnProceso) {
          adopcion.estado = EstadoAdopcion.RECHAZADA;
          await this.adopcionRepository.save(adopcion);
        }
      }

      if (data.estado_adopcion === Estado.ADOPTADO) {
        // Si pasa a ADOPTADO → rechazar también las demás en proceso
        const adopcionesEnProceso = await this.adopcionRepository.find({
          where: { mascota: { id_mascota }, estado: EstadoAdopcion.EN_PROCESO }
        });

        for (const adopcion of adopcionesEnProceso) {
          adopcion.estado = EstadoAdopcion.RECHAZADA;
          await this.adopcionRepository.save(adopcion);
        }
      }
    }

    Object.assign(mascota, data);
    return this.mascotaRepository.save(mascota);
  }


  async remove(id_mascota: number): Promise<void> {
    const mascota = await this.findOne(id_mascota);
    await this.mascotaRepository.remove(mascota);
  }

  //filtra por refugio
  async findByRefugio(refugioId: number): Promise<Mascota[]> {
    return this.mascotaRepository.find({
      where: { refugio: { id: refugioId } },
      relations: ['refugio'],
    });
  }

  //transferir
  async transferir(mascota: Mascota, refugioDestino: Refugio): Promise<Mascota> {
  mascota.refugio = refugioDestino;
  return this.mascotaRepository.save(mascota);
  }
}
