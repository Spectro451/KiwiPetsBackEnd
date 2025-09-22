import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { Historial } from './historial.entity';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { MascotaService } from 'src/mascota/mascota.service';

@Controller('historial')
export class HistorialController {
  constructor(
    private readonly historialService: HistorialService,
    private readonly mascotaService: MascotaService,
  ){}

  @UseGuards(JwtAuthguard)
  @Get()
  async findAll(@Request() request): Promise<Historial[]> {
    if(!request.user.admin){
      throw new ForbiddenException('No tienes permisos')
    }
    return await this.historialService.findAll();
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id:number, @Request() request): Promise<Historial>{
    const historial = await this.historialService.findOne(id);
    if(!request.user.admin && historial.mascota.refugio.usuario.id !== request.user.id){
      throw new ForbiddenException('No tienes permisos')
    }
    return historial;
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Post()
  async create(
    @Body() historialData: Partial<Historial>,
    @Request() request
  ): Promise<Historial> {
    const mascotaId = historialData.mascota?.id_mascota;
    if (!mascotaId) {
      throw new NotFoundException('Debes indicar la mascota a la que pertenece el historial');
    }

    const mascota = await this.mascotaService.findOne(mascotaId);
    if (!request.user.admin && mascota.refugio.usuario.id !== request.user.id) {
      throw new ForbiddenException('No puedes agregar historial a esta mascota');
    }
    return this.historialService.create(mascotaId, historialData);
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Put(':id')
  async update(
    @Param('id',ParseIntPipe) id: number,
    @Body() historialData: Partial<Historial>,
    @Request() request
  ): Promise<Historial> {
    const historial = await this.historialService.findOne(id);

    if (!request.user.admin && historial.mascota.refugio.usuario.id !== request.user.id) {
      throw new ForbiddenException('No puedes editar este historial');
    }

    return await this.historialService.update(id, historialData);
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number, @Request() request): Promise<{ message: string }> {
    const historial = await this.historialService.findOne(id);

    if (!request.user.admin && historial.mascota.refugio.usuario.id !== request.user.id) {
      throw new ForbiddenException('No puedes eliminar este historial');
    }

    await this.historialService.remove(id);
    return { message: `Historial con ID ${id} eliminado correctamente` };
  }
  
  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Get('mascota/:id_mascota')
  async findByMascota(@Param('id_mascota',ParseIntPipe) id_mascota: number, @Request() request): Promise<Historial[]> {
    const mascota = await this.mascotaService.findOne(id_mascota);

    if (!request.user.admin && mascota.refugio.usuario.id !== request.user.id) {
      throw new ForbiddenException('No puedes ver el historial de esta mascota');
    }

    return await this.historialService.findByMascota(id_mascota);
  }
}
