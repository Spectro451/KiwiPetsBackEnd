import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { Notificaciones } from './notificaciones.entity';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';

@Controller('notificaciones')
@UseGuards(JwtAuthguard)
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService){}

  @Get()
  async findAll(@Request() request): Promise<Notificaciones[]> {
    if(request.user.admin){
      return this.notificacionesService.findAll();
    }
    return this.notificacionesService.findByUsuario(request.user.id);
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id:number, @Request() request): Promise<Notificaciones> {
    const notificacion = await this.notificacionesService.findOne(id);
    if(!notificacion){
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
    }

    if(!request.user.admin && notificacion.usuario.id !== request.user.id){
      throw new ForbiddenException('No tienes permiso para ver esta notificación');
    }

    return notificacion;
  }

  @Post()
  async create(@Body() data: Partial<Notificaciones>, @Request() request): Promise<Notificaciones> {
    if(!request.user.admin){
      throw new ForbiddenException('Solo admin puede crear notificaciones');
    }
    return this.notificacionesService.create(data);
  }

  @Put(':id')
  async update(@Param('id',ParseIntPipe) id: number, @Body() data: Partial<Notificaciones>, @Request() request): Promise<Notificaciones> {
    if(!request.user.admin){
      throw new ForbiddenException('Solo admin puede editar notificaciones');
    }
    return this.notificacionesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number, @Request() request): Promise<{ message: string }> {
    if(!request.user.admin){
      throw new ForbiddenException('Solo admin puede eliminar notificaciones');
    }
    await this.notificacionesService.remove(id);
    return { message: `Notificación con ID ${id} eliminada correctamente` };
  }
}
