import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { Historial } from './historial.entity';

@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService){}

  @Get()
  async findAll(): Promise<Historial[]> {
    return await this.historialService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id:number): Promise<Historial>{
    const historial = await this.historialService.findOne(id);
    if(!historial){
      throw new NotFoundException(`Historial con ID ${id} no encontrada`);
    }
    return historial;
  }

  @Post()
  async create(@Body() historialData: Partial<Historial>): Promise<Historial> {
    return await this.historialService.create(historialData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() historialData: Partial<Historial>
  ): Promise<Historial> {
    const updated = await this.historialService.update(id, historialData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar la historial con ID ${id}`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.historialService.remove(id);
    return { message: `Historial con ID ${id} eliminada correctamente` };
  }
}
