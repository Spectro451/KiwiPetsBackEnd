import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
      return this.favoritosRepository.find({
        relations:['mascota', 'adoptante', 'mascota.refugio'],
      });
    }
  
    //GetId
    async findOne(id: number): Promise<Favoritos> {
      const favoritos = await this.favoritosRepository.findOne({
        where: { id },
        relations: ['adoptante', 'mascota'], // <--- esto carga las relaciones
      });
      if (!favoritos) throw new NotFoundException(`Favoritos con id ${id} no encontrada`);
      return favoritos;
    }
  
    //Post
    async create(data: Partial<Favoritos>): Promise<Favoritos> {
      if (!data.adoptante?.rut) {
        throw new BadRequestException('Adoptante inválido');
      }
      if (!data.mascota?.id_mascota) {
        throw new BadRequestException('Mascota inválida');
      }
      const existe = await this.favoritosRepository.findOne({
        where: {
          adoptante:{rut:data.adoptante?.rut},
          mascota:{id_mascota:data.mascota?.id_mascota}
        }
      });
      if (existe){
        throw new BadRequestException('Ya lo tienes como favorito');
      }
      const nuevoFavorito = this.favoritosRepository.create({
        adoptante: { rut: data.adoptante.rut },
        mascota: { id_mascota: data.mascota.id_mascota }
      });

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

    //filtro por adoptante
    async findByAdoptante(adoptanteRut:string):Promise<Favoritos[]>{
      return this.favoritosRepository.find({
        where:{adoptante:{rut:adoptanteRut}},
        relations:['mascota','mascota.refugio'],
      })
    }
}
