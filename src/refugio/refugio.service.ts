import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Refugio } from './refugio.entity';
import { Repository } from 'typeorm';
import { Mascota } from 'src/mascota/mascota.entity';

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

  //busca por idUsuario
  async findByUsuarioId(usuarioId: number): Promise<Refugio | null> {
    return this.refugioRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations:['mascotas', 'usuario']
    });
  }

  //todas las mascotas de un refugio
  async findMascotasByUsuario(usuarioId:number): Promise<Mascota[]>{
    const refugio = await this.findByUsuarioId(usuarioId);
    if(!refugio){
      throw new NotFoundException('Refugio asociado no encontrado')
    }
    return refugio.mascotas || [];
  }
}
