import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { AdoptanteService } from './adoptante.service';
import { Adoptante } from './adoptante.entity';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('adoptante')
export class AdoptanteController {
  constructor(private readonly adoptanteService: AdoptanteService){}

  @UseGuards(JwtAuthguard)
  @Get()
  async findAll(@Request() request): Promise<Adoptante[]>{
    if(!request.user.admin){
      throw new ForbiddenException('No tienes permisos')
    }
    return await this.adoptanteService.findAll();
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Adoptante')
  @Get(':rut')
  async findOne(@Param('rut') rut:string, @Request() request): Promise<Adoptante>{
    const adoptante = await this.adoptanteService.findOne(rut);
    if(!adoptante){
      throw new NotFoundException(`Adoptante con rut ${rut} no encontrado`);
    }

    if(!request.user.admin && request.user.id !== adoptante.usuario.id){
      throw new ForbiddenException('No tienes permisos para ver este adoptante')
    }
    return adoptante;
  }

  @UseGuards(JwtAuthguard)
  @Post()
  async create(@Body() adoptanteData: Partial<Adoptante>,@Request() request): Promise<Adoptante>{
    if(!request.user.admin){
      throw new ForbiddenException('No tienes permisos')
    }
    return await this.adoptanteService.create(adoptanteData);
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Adoptante')
  @Put(':rut')
  async update(@Param('rut') rut:string, @Body() adoptanteData: Partial<Adoptante>, @Request() request): Promise<Adoptante>{
    const adoptante = await this.adoptanteService.findOne(rut);
    if(!adoptante){
      throw new NotFoundException(`No se pudo encontrar el adoptante con RUT ${rut}`);
    }
    if(!request.user.admin && request.user.id !== adoptante.usuario.id){
      throw new ForbiddenException('No tienes permisos para editar este adoptante')
    }
    const updated = await this.adoptanteService.update(rut, adoptanteData);
    return updated;
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Adoptante')
  @Delete(':rut')
  async remove(@Param('rut') rut: string, @Request() request): Promise<{ message: string }> {
    const adoptante = await this.adoptanteService.findOne(rut);
    if(!adoptante){
      throw new NotFoundException(`No se pudo encontrar el adoptante con RUT ${rut}`);
    }
    if(!request.user.admin && request.user.id !== adoptante.usuario.id){
      throw new ForbiddenException('No tienes permisos para editar este adoptante')
    }
    await this.adoptanteService.remove(rut);
    return { message: `Adoptante con RUT ${rut} eliminado correctamente` };
  }
}
