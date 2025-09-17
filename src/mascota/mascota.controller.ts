import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { MascotaService } from './mascota.service';
import { Mascota } from './mascota.entity';

@Controller('mascota')
export class MascotaController {
  constructor(private readonly mascotaService: MascotaService){}

  @Get()
  async findAll(): Promise<Mascota[]> {
    return await this.mascotaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id:number): Promise<Mascota>{
    const mascota = await this.mascotaService.findOne(id);
    if(!mascota){
      throw new NotFoundException(`Mascota con ID ${id} no encontrada`);
    }
    return mascota;
  }

  @Post()
  async create(@Body() mascotaData: Partial<Mascota>): Promise<Mascota> {
    return await this.mascotaService.create(mascotaData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() mascotaData: Partial<Mascota>
  ): Promise<Mascota> {
    const updated = await this.mascotaService.update(id, mascotaData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar la mascota con ID ${id}`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.mascotaService.remove(id);
    return { message: `Mascota con ID ${id} eliminada correctamente` };
  }
}
