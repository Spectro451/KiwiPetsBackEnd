import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AdopcionService } from './adopcion.service';
import { RefugioService } from 'src/refugio/refugio.service';
import { Adopcion } from './adopcion.entity';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AdoptanteService } from 'src/adoptante/adoptante.service';

@Controller('adopcion')
export class AdopcionController {
  constructor(
    private readonly adopcionService: AdopcionService,
    private readonly refugioService:RefugioService,
    private readonly adoptanteService:AdoptanteService,
  ) {}

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio', 'Adoptante')
  @Get()
  async findAll(@Request() request): Promise<Adopcion[]> {
    if (request.user.admin) {
      return await this.adopcionService.findAll();
    }

    if (request.user.tipo === 'Refugio') {
      const refugio = await this.refugioService.findByUsuarioId(request.user.id);
      if (!refugio) throw new NotFoundException('Refugio no encontrado');
      return await this.adopcionService.findByRefugio(refugio.id);
    }

    if (request.user.tipo === 'Adoptante') {
      const adoptante = await this.adoptanteService.findByUsuarioId(request.user.id);
      if (!adoptante) throw new NotFoundException('Adoptante no encontrado');
      return await this.adopcionService.findByAdoptante(adoptante.rut);
    }

    throw new ForbiddenException('No tienes permiso');
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio','Adoptante')
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number,@Request() request): Promise<Adopcion> {
    const adopcion = await this.adopcionService.findOne(id);
    if(request.user.admin){
      return adopcion;
    }

    if(request.user.tipo === 'Refugio'){
      const refugio = await this.refugioService.findByUsuarioId(request.user.id);
      if(!refugio){
        throw new NotFoundException('Refugio no encontrado');
      }
      if(adopcion.refugio.id !== refugio.id){
        throw new ForbiddenException('No puedes ver esta adopcion');
      }
      return adopcion;
    }
    if(request.user.tipo === 'Adoptante'){
      const adoptante = await this.adoptanteService.findByUsuarioId(request.user.id);
      if(!adoptante){
        throw new NotFoundException('Adoptante no encontrado');
      }
      if(adopcion.adoptante.rut !== adoptante.rut){
        throw new ForbiddenException('No puedes ver esta adopcion');
      }
      return adopcion;
    }

    throw new ForbiddenException('No tienes permiso');
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Adoptante')
  @Post()
  async create(@Body() data: Partial<Adopcion>, @Request() request): Promise<Adopcion> {
    if (!request.user.admin) {
      const adoptante = await this.adoptanteService.findByUsuarioId(request.user.id);
      if (!adoptante) {
        throw new NotFoundException('Adoptante no encontrado');
      }
      data.adoptante = adoptante;
    }
    return await this.adopcionService.create(data);
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Put(':id')
  async update(
    @Param('id',ParseIntPipe) id: number,
    @Body() adopcionData: Partial<Adopcion>,
    @Request() request
  ): Promise<Adopcion> {
    const adopcion = await this.adopcionService.findOne(id);
    if (!adopcion) throw new NotFoundException(`Adopcion con ID ${id} no encontrada`);

    if (request.user.admin) {
      return await this.adopcionService.update(id, adopcionData);
    }

    if (request.user.tipo === 'Refugio') {
      const refugio = await this.refugioService.findByUsuarioId(request.user.id);
      if (!refugio) throw new NotFoundException('Refugio no encontrado');
      if (adopcion.refugio.id !== refugio.id) {
        throw new ForbiddenException('No puedes actualizar esta adopcion');
      }
      return await this.adopcionService.update(id, adopcionData);
    }

    throw new ForbiddenException('No tienes permiso');
  }

  @UseGuards(JwtAuthguard,RolesGuard)
  @Roles('Adoptante')
  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number, @Request() request): Promise<{ message: string }> {
    const adopcion = await this.adopcionService.findOne(id);
    if(!adopcion){
      throw new NotFoundException('Adopcion no encontrada')
    }
    if(!request.user.admin && request.user.id !== adopcion.adoptante.usuario.id){
      throw new ForbiddenException('No tienes permiso para eliminar esta adopción');
    }
    await this.adopcionService.remove(id);
    return { message: `Adopcion con ID ${id} eliminada correctamente` };
  }
}
