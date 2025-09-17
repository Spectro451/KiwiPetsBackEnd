import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { RefugioService } from './refugio.service';
import { Refugio } from './refugio.entity';

@Controller('refugio')
export class RefugioController {
  constructor(private readonly refugioService: RefugioService){}

  @Get()
  async findAll(): Promise<Refugio[]> {
    return await this.refugioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id:number): Promise<Refugio>{
    const refugio = await this.refugioService.findOne(id);
    if(!refugio){
      throw new NotFoundException(`Refugio con ID ${id} no encontrada`);
    }
    return refugio;
  }

  @Post()
  async create(@Body() refugioData: Partial<Refugio>): Promise<Refugio> {
    return await this.refugioService.create(refugioData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() refugioData: Partial<Refugio>
  ): Promise<Refugio> {
    const updated = await this.refugioService.update(id, refugioData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar la refugio con ID ${id}`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.refugioService.remove(id);
    return { message: `Refugio con ID ${id} eliminada correctamente` };
  }
}
