import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Refugio } from './refugio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefugioService {
  constructor(
    @InjectRepository(Refugio)
    private readonly refugioRepository: Repository<Refugio>,
  ) {}

  //Get
  async findAll(): Promise<Refugio[]> {
    return this.refugioRepository.find();
  }

  //GetId
  async findOne(id: number): Promise<Refugio> {
    const refugio = await this.refugioRepository.findOne({ where: { id }, relations:['usuario'] });
    if (!refugio) throw new NotFoundException(`Refugio con id ${id} no encontrada`);
    return refugio;
  }

  //Post
  async create(data: Partial<Refugio>): Promise<Refugio> {
    const nuevaRefugio = this.refugioRepository.create(data);
    return this.refugioRepository.save(nuevaRefugio);
  }

  //Put
  async update(id: number, data: Partial<Refugio>): Promise<Refugio> {
    const refugio = await this.findOne(id);
    Object.assign(refugio, data);
    return this.refugioRepository.save(refugio);
  }

  //delete
  async remove(id: number): Promise<void> {
    const refugio = await this.findOne(id);
    await this.refugioRepository.remove(refugio);
  }
}
