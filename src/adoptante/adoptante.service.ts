import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Adoptante } from './adoptante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdoptanteService {
  constructor(
      @InjectRepository(Adoptante)
      private readonly adoptanteRepository: Repository<Adoptante>,
    ) {}
  
    //Get
    async findAll(): Promise<Adoptante[]> {
      return this.adoptanteRepository.find();
    }
  
    //GetId
    async findOne(rut:string): Promise<Adoptante> {
      const adoptante = await this.adoptanteRepository.findOne({where:{rut},relations:['usuario']});
      if (!adoptante) throw new NotFoundException(`Adoptante con rut ${rut} no encontrada`);
      return adoptante;
    }
  
    //Post
    async create(data: Partial<Adoptante>): Promise<Adoptante> {
      const nuevoAdoptante = this.adoptanteRepository.create(data);
      return this.adoptanteRepository.save(nuevoAdoptante);
    }
  
    //Put
    async update(rut:string, data:Partial<Adoptante>): Promise<Adoptante> {
      const adoptante = await this.findOne(rut);
      Object.assign(adoptante, data);
      return this.adoptanteRepository.save(adoptante);
    }
  
    //delete
    async remove(rut:string): Promise<void>{
      const adoptante = await this.findOne(rut);
      await this.adoptanteRepository.remove(adoptante);
    }

    //busca por idUsuario
    async findByUsuarioId(usuarioId: number): Promise<Adoptante | null> {
      return this.adoptanteRepository.findOne({
        where: { usuario: { id: usuarioId } },
      });
    }
}
