import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favoritos } from './favoritos.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritosService {
  constructor(
      @InjectRepository(Favoritos)
      private readonly favoritosRepository: Repository<Favoritos>,
    ) {}
  
    //Get
    async findAll(): Promise<Favoritos[]> {
      return this.favoritosRepository.find();
    }
  
    //GetId
    async findOne(id:number): Promise<Favoritos> {
      const favoritos = await this.favoritosRepository.findOne({where:{id}});
      if (!favoritos) throw new NotFoundException(`Favoritos con id ${id} no encontrada`);
      return favoritos;
    }
  
    //Post
    async create(data: Partial<Favoritos>): Promise<Favoritos> {
      const nuevoFavorito = this.favoritosRepository.create(data);
      return this.favoritosRepository.save(nuevoFavorito);
    }
  
    //Put
    async update(id:number, data:Partial<Favoritos>): Promise<Favoritos> {
      const favoritos = await this.findOne(id);
      Object.assign(favoritos, data);
      return this.favoritosRepository.save(favoritos);
    }
  
    //delete
    async remove(id:number): Promise<void>{
      const favoritos = await this.findOne(id);
      await this.favoritosRepository.remove(favoritos);
    }
}
