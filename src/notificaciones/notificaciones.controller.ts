import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { Notificaciones } from './notificaciones.entity';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService){}

  @Get()
  async findAll(): Promise<Notificaciones[]> {
    return await this.notificacionesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id:number): Promise<Notificaciones>{
    const notificaciones = await this.notificacionesService.findOne(id);
    if(!notificaciones){
      throw new NotFoundException(`Notificaciones con ID ${id} no encontrada`);
    }
    return notificaciones;
  }

  @Post()
  async create(@Body() notificacionesData: Partial<Notificaciones>): Promise<Notificaciones> {
    return await this.notificacionesService.create(notificacionesData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() notificacionesData: Partial<Notificaciones>
  ): Promise<Notificaciones> {
    const updated = await this.notificacionesService.update(id, notificacionesData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar la notificaciones con ID ${id}`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.notificacionesService.remove(id);
    return { message: `Notificaciones con ID ${id} eliminada correctamente` };
  }
}
