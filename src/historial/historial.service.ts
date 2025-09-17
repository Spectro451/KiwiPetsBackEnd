import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historial } from './historial.entity';


@Injectable()
export class HistorialClinicoService {
  constructor(
    @InjectRepository(Historial)
    private readonly historialRepository: Repository<Historial>,
  ) {}

  async findAll(): Promise<Historial[]> {
    return this.historialRepository.find();
  }

  async findOne(id: number): Promise<Historial> {
    const historial = await this.historialRepository.findOne({ where: { id } });
    if (!historial) throw new NotFoundException(`Historial con id ${id} no encontrado`);
    return historial;
  }

  async create(data: Partial<Historial>): Promise<Historial> {
    const nuevoHistorial = this.historialRepository.create(data);
    return this.historialRepository.save(nuevoHistorial);
  }

  async update(id: number, data: Partial<Historial>): Promise<Historial> {
    const historial = await this.findOne(id);
    Object.assign(historial, data);
    return this.historialRepository.save(historial);
  }

  async remove(id: number): Promise<void> {
    const historial = await this.findOne(id);
    await this.historialRepository.remove(historial);
  }
}
