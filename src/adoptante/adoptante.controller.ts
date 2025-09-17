import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { AdoptanteService } from './adoptante.service';
import { Adoptante } from './adoptante.entity';

@Controller('adoptante')
export class AdoptanteController {
  constructor(private readonly adoptanteService: AdoptanteService){}

  @Get()
  async findAll(): Promise<Adoptante[]>{
    return await this.adoptanteService.findAll();
  }

  @Get(':rut')
  async findOne(@Param('rut') rut:string): Promise<Adoptante>{
    const adoptante = await this.adoptanteService.findOne(rut);
    if(!adoptante){
      throw new NotFoundException(`Adoptante con rut ${rut} no encontrado`);
    }
    return adoptante;
  }

  @Post()
  async create(@Body() adoptanteData: Partial<Adoptante>): Promise<Adoptante>{
    return await this.adoptanteService.create(adoptanteData);
  }

  @Put(':rut')
  async update(@Param('rut') rut:string, @Body() adoptanteData: Partial<Adoptante>): Promise<Adoptante>{
    const updated = await this.adoptanteService.update(rut, adoptanteData);
    if(!updated){
      throw new NotFoundException(`No se pudo actualizar el adoptante con RUT ${rut}`);
    }
    return updated;
  }
  @Delete(':rut')
  async remove(@Param('rut') rut: string): Promise<{ message: string }> {
    await this.adoptanteService.remove(rut);
    return { message: `Adoptante con RUT ${rut} eliminado correctamente` };
  }
}
