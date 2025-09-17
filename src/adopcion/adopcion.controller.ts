import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { AdopcionService } from './adopcion.service';
import { Adopcion } from './adopcion.entity';

@Controller('adopcion')
export class AdopcionController {
  constructor(private readonly adopcionService: AdopcionService) {}

  @Get()
  async findAll(): Promise<Adopcion[]> {
    return await this.adopcionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Adopcion> {
    const adopcion = await this.adopcionService.findOne(id);
    if (!adopcion) {
      throw new NotFoundException(`Adopcion con ID ${id} no encontrada`);
    }
    return adopcion;
  }

  @Post()
  async create(@Body() adopcionData: Partial<Adopcion>): Promise<Adopcion> {
    return await this.adopcionService.create(adopcionData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() adopcionData: Partial<Adopcion>
  ): Promise<Adopcion> {
    const updated = await this.adopcionService.update(id, adopcionData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar la adopcion con ID ${id}`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.adopcionService.remove(id);
    return { message: `Adopcion con ID ${id} eliminada correctamente` };
  }
}
