import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacunas } from './vacunas.entity';
import { Repository } from 'typeorm';
import { Mascota } from 'src/mascota/mascota.entity';

@Injectable()
export class VacunasService {
  constructor(
    @InjectRepository(Vacunas)
    private readonly vacunasRepository: Repository<Vacunas>,
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  //Get
  async findAll(): Promise<Vacunas[]> {
    return this.vacunasRepository.find();
  }

  //GetId
  async findOne( id: number): Promise<Vacunas> {
    const vacunas = await this.vacunasRepository.findOne({ where: { id } });
    if (!vacunas) throw new NotFoundException(`Vacunas con id ${id} no encontrada`);
    return vacunas;
  }

  //Post
  async create(mascotaId:number, data: Partial<Vacunas>): Promise<Vacunas> {
    const mascota = await this.mascotaRepository.findOne({
      where:{id_mascota:mascotaId},
    })
    if(!mascota){
      throw new NotFoundException('Mascota no encontrada');
    }
    const nuevaVacuna = this.vacunasRepository.create({
      ...data,
      mascota,
    });
    return this.vacunasRepository.save(nuevaVacuna);
  }

  //Put
  async update(id: number, data: Partial<Vacunas>): Promise<Vacunas> {
    const vacunas = await this.findOne(id);
    Object.assign(vacunas, data);
    return this.vacunasRepository.save(vacunas);
  }

  //delete
  async remove(id: number): Promise<void> {
    const vacunas = await this.findOne(id);
    await this.vacunasRepository.remove(vacunas);
  }

  //buscar por mascota
  async findByMascota(mascotaId:number):Promise<Vacunas[]>{
    return this.vacunasRepository.find({
      where:{mascota:{id_mascota:mascotaId}},
      relations:['mascota'],
    })
  }
}
