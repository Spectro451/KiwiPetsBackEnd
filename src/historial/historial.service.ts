import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historial } from './historial.entity';
import { Mascota } from 'src/mascota/mascota.entity';


@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private readonly historialRepository: Repository<Historial>,
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  async findAll(): Promise<Historial[]> {
    return this.historialRepository.find();
  }

  async findOne(id: number): Promise<Historial> {
    const historial = await this.historialRepository.findOne({ where: { id } });
    if (!historial) throw new NotFoundException(`Historial con id ${id} no encontrado`);
    return historial;
  }

  async create(mascotaId:number, data: Partial<Historial>): Promise<Historial> {
    const mascota = await this.mascotaRepository.findOne({
      where:{id_mascota:mascotaId},
    })
    if(!mascota){
      throw new NotFoundException('Mascota no encontrada');
    }
    const nuevoHistorial = this.historialRepository.create({
      ...data,
      mascota,
    });
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

  //buscar por mascota
  async findByMascota(mascotaId:number):Promise<Historial[]>{
    return this.historialRepository.find({
      where:{mascota:{id_mascota:mascotaId}},
      relations:['mascota'],
    })
  }
}
