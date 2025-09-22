import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { RefugioService } from './refugio.service';
import { Refugio } from './refugio.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Mascota } from 'src/mascota/mascota.entity';

@Controller('refugio')
export class RefugioController {
  constructor(private readonly refugioService: RefugioService){}

  @Get()
  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Adoptante', 'Refugio')
  async findAll(): Promise<Refugio[]> {
    return await this.refugioService.findAll();
  }

  @UseGuards(JwtAuthguard,RolesGuard)
  @Roles('Refugio')//solo refugio para que un adoptante no haga coso
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id:number,@Request() request): Promise<Refugio>{
    const refugio = await this.refugioService.findOne(id);
    if(!refugio){
      throw new NotFoundException(`Refugio con ID ${id} no encontrada`);
    }

    if(!request.user.admin && request.user.id !== refugio.usuario.id){
      throw new ForbiddenException('No tienes permiso para ver este refugio');
    }
    return refugio;
  }

  @UseGuards(JwtAuthguard)
  @Post()
  async create(@Body() refugioData: Partial<Refugio>, @Request() request): Promise<Refugio> {
    if(!request.user.admin){
      throw new ForbiddenException('No tienes permiso');
    }
    return await this.refugioService.create(refugioData);
  }

  @UseGuards(JwtAuthguard,RolesGuard)
  @Roles('Refugio')
  @Put(':id')
  async update(
    @Param('id',ParseIntPipe) id: number,
    @Body() refugioData: Partial<Refugio>,
    @Request() request,
  ): Promise<Refugio> {
    const refugio = await this.refugioService.findOne(id);
    if (!refugio) {
      throw new NotFoundException(`No se pudo actualizar la refugio con ID ${id}`);
    }

    if(!request.user.admin && request.user.id !== refugio.usuario.id){
      throw new ForbiddenException('No tienes permiso para editar este refugio');
    }

    const updated = await this.refugioService.update(id,refugioData)
    return updated;
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number, @Request() request): Promise<{ message: string }> {
    const refugio = await this.refugioService.findOne(id);
    if(!request.user.admin && request.user.id !== refugio.usuario.id){
      throw new ForbiddenException('No tienes permiso para eliminar este refugio');
    }

    await this.refugioService.remove(id);
    return { message: `Refugio con ID ${id} eliminada correctamente` };
  }

  @Get('mascotas')
  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  async getMisMascotas(@Request() request): Promise<Mascota[]> {
    return this.refugioService.findMascotasByUsuario(request.user.id);
  }
}
