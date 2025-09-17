import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { VacunasService } from './vacunas.service';
import { Vacunas } from './vacunas.entity';

@Controller('vacunas')
export class VacunasController {
  constructor(private readonly vacunasService: VacunasService){}

  @Get()
  async findAll(): Promise<Vacunas[]> {
    return await this.vacunasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id:number): Promise<Vacunas>{
    const vacunas = await this.vacunasService.findOne(id);
    if(!vacunas){
      throw new NotFoundException(`Vacunas con ID ${id} no encontrada`);
    }
    return vacunas;
  }

  @Post()
  async create(@Body() vacunasData: Partial<Vacunas>): Promise<Vacunas> {
    return await this.vacunasService.create(vacunasData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() vacunasData: Partial<Vacunas>
  ): Promise<Vacunas> {
    const updated = await this.vacunasService.update(id, vacunasData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar la vacunas con ID ${id}`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.vacunasService.remove(id);
    return { message: `Vacunas con ID ${id} eliminada correctamente` };
  }
}
