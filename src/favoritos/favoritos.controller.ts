import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { Favoritos } from './favoritos.entity';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AdoptanteService } from 'src/adoptante/adoptante.service';

@Controller('favoritos')
export class FavoritosController {
  constructor(
    private readonly favoritosService: FavoritosService,
    private readonly adoptanteService:AdoptanteService,
  ){}

  @UseGuards(JwtAuthguard,RolesGuard)
  @Roles('Adoptante')
  @Get()
  async findAll(@Request() request): Promise<Favoritos[]> {
    if(request.user.admin){
      return await this.favoritosService.findAll();
    }
    if(request.user.tipo==='Adoptante'){
      const adoptante = await this.adoptanteService.findByUsuarioId(request.user.id);
      if(!adoptante){
        throw new NotFoundException('Adoptante no encontrado');
      }
      return await this.favoritosService.findByAdoptante(adoptante.rut);
    }
    throw new ForbiddenException('No tienes permisos');
  }

  @UseGuards(JwtAuthguard,RolesGuard)
  @Roles('Adoptante')
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id:number,@Request() request): Promise<Favoritos>{
    const favoritos = await this.favoritosService.findOne(id);
    if (request.user.admin) return favoritos;
    const adoptante = await this.adoptanteService.findByUsuarioId(request.user.id);
    if(!adoptante){
      throw new NotFoundException('Adoptante no encontrado');
    }
    if(favoritos.adoptante.rut !== adoptante.rut){
      throw new ForbiddenException('No tienes permisos');
    }
    return favoritos
  }

  @UseGuards(JwtAuthguard,RolesGuard)
  @Roles('Adoptante')
  @Post()
  async create(@Body() favoritosData: Partial<Favoritos>, @Request() request): Promise<Favoritos> {
    if(request.user.admin){
      return await this.favoritosService.create(favoritosData);
    }
    const adoptante = await this.adoptanteService.findByUsuarioId(request.user.id);
    if (!adoptante){
      throw new NotFoundException('Adoptante no encontrado');
    }
    
    favoritosData.adoptante=adoptante;
    return await this.favoritosService.create(favoritosData);
  }

  @UseGuards(JwtAuthguard)
  @Put(':id')
  async update(
    @Param('id',ParseIntPipe) id: number,
    @Request() request,
    @Body() favoritosData: Partial<Favoritos>
  ): Promise<Favoritos> {
    if(!request.user.admin){
      throw new ForbiddenException('No tienes permisos');
    }
    const updated = await this.favoritosService.update(id, favoritosData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar el favorito con ID ${id}`);
    }
    return updated;
  }

  @UseGuards(JwtAuthguard,RolesGuard)
  @Roles('Adoptante')
  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number, @Request() request): Promise<{ message: string }> {
    const favorito = await this.favoritosService.findOne(id);
    if(!favorito){
      throw new NotFoundException(`Favorito con ID ${id} no encontrado`);
    }
    if(request.user.admin){
      await this.favoritosService.remove(id);
      return { message: `Favoritos con ID ${id} eliminada correctamente` };
    }
    const adoptante = await this.adoptanteService.findByUsuarioId(request.user.id);
    if(!adoptante){
      throw new NotFoundException('Adoptante no encontrado');
    }
    if (favorito.adoptante.rut!==adoptante.rut){
      throw new ForbiddenException('No tienes permiso para borrar este favorito');
    }
    await this.favoritosService.remove(id);
    return { message: `Favoritos con ID ${id} eliminada correctamente` };
  }
}
