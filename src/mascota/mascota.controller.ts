import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { MascotaService } from './mascota.service';
import { Mascota } from './mascota.entity';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RefugioService } from 'src/refugio/refugio.service';

@Controller('mascota')
export class MascotaController {
  constructor(
    private readonly mascotaService: MascotaService,
    private readonly refugioService: RefugioService,
  ){}

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Adoptante', 'Refugio')
  @Get()
  async findAll(@Request() request): Promise<Mascota[]> {
    if(request.user.admin || request.user.tipo=="Adoptante"){
      return await this.mascotaService.findAll();
    } else if (request.user.tipo=="Refugio"){
      return this.mascotaService.findByRefugio(request.user.id)
    } else {
      throw new ForbiddenException('No tienes permisos')
    }
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Adoptante', 'Refugio')
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() request): Promise<Mascota> {
    const mascota = await this.mascotaService.findOne(id);
    if (!mascota) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);

    //if super largo que basicamente revisa que sea admin, refugio o en su defecto que busque solo los de mi refugio
    if (!request.user.admin && request.user.tipo === 'Refugio' && mascota.refugio.usuario.id !== request.user.id) {
      throw new ForbiddenException('No puedes acceder a esta mascota');
    }

    return mascota;
  }

  @Post()
  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  async create(@Body() mascotaData: Partial<Mascota>, @Request() request): Promise<Mascota> {

    if (request.user.tipo === 'Refugio') {
      const refugio = await this.refugioService.findByUsuarioId(request.user.id);
      if (!refugio) {
        throw new ForbiddenException('Este usuario no tiene un refugio asociado');
      }
      mascotaData.refugio = refugio;
    }
    return await this.mascotaService.create(mascotaData);
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() mascotaData: Partial<Mascota>,
    @Request() request,
  ): Promise<Mascota> {
    const mascota = await this.mascotaService.findOne(id);
    if(!mascota){
      throw new NotFoundException('Mascota no encontrada');
    }
    if(request.user.tipo==='Refugio'){
      const refugio = await this.refugioService.findByUsuarioId(request.user.id);
      if(!refugio || mascota.refugio.id !== refugio.id){
        throw new ForbiddenException('No tienes permiso para modificar esta mascota');
      }
    }
    return await this.mascotaService.update(id, mascotaData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  async remove(@Param('id') id: number, @Request() request): Promise<{ message: string }> {
    const mascota = await this.mascotaService.findOne(id);
    if (!mascota) throw new NotFoundException(`Mascota con ID ${id} no encontrada`);

    if (request.user.tipo === 'Refugio') {
      const refugio = await this.refugioService.findByUsuarioId(request.user.id);
      if (!refugio || mascota.refugio.id !== refugio.id) {
        throw new ForbiddenException('No puedes eliminar esta mascota');
      }
    }
    await this.mascotaService.remove(id);
    return { message: `Mascota con ID ${id} eliminada correctamente` };
  }
}
