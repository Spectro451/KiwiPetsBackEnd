import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { Favoritos } from './favoritos.entity';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService){}

  @Get()
  async findAll(): Promise<Favoritos[]> {
    return await this.favoritosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id:number): Promise<Favoritos>{
    const favoritos = await this.favoritosService.findOne(id);
    if(!favoritos){
      throw new NotFoundException(`Favoritos con ID ${id} no encontrada`);
    }
    return favoritos;
  }

  @Post()
  async create(@Body() favoritosData: Partial<Favoritos>): Promise<Favoritos> {
    return await this.favoritosService.create(favoritosData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() favoritosData: Partial<Favoritos>
  ): Promise<Favoritos> {
    const updated = await this.favoritosService.update(id, favoritosData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar la favoritos con ID ${id}`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.favoritosService.remove(id);
    return { message: `Favoritos con ID ${id} eliminada correctamente` };
  }
}
