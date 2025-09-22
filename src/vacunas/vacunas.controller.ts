import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { VacunasService } from './vacunas.service';
import { Vacunas } from './vacunas.entity';
import { MascotaService } from 'src/mascota/mascota.service';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('vacunas')
export class VacunasController {
  constructor(
    private readonly vacunasService: VacunasService,
    private readonly mascotaService:MascotaService,
  ){}

  @UseGuards(JwtAuthguard)
  @Get()
  async findAll(@Request() request): Promise<Vacunas[]> {
    if(!request.user.admin){
      throw new ForbiddenException('No tienes permisos')
    }
    return await this.vacunasService.findAll();
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id:number, @Request() request): Promise<Vacunas>{
    const vacuna = await this.vacunasService.findOne(id);
    if(!request.user.admin && vacuna.mascota.refugio.usuario.id !== request.user.id){
      throw new ForbiddenException('No tienes permisos')
    }
    return vacuna;
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Post()
  async create(
    @Body() vacunaData: Partial<Vacunas>,
    @Request() request
  ): Promise<Vacunas> {
    const mascotaId = vacunaData.mascota?.id_mascota;
    if (!mascotaId) {
      throw new NotFoundException('Debes indicar la mascota a la que pertenece la vacuna');
    }

    const mascota = await this.mascotaService.findOne(mascotaId);
    if (!request.user.admin && mascota.refugio.usuario.id !== request.user.id) {
      throw new ForbiddenException('No puedes agregar vacunas a esta mascota');
    }
    return this.vacunasService.create(mascotaId, vacunaData);
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Put(':id')
  async update(
    @Param('id',ParseIntPipe) id: number,
    @Body() vacunasData: Partial<Vacunas>,
    @Request() request,
  ): Promise<Vacunas> {
    const vacuna = await this.vacunasService.findOne(id);

    if (!request.user.admin && vacuna.mascota.refugio.usuario.id !== request.user.id) {
      throw new ForbiddenException('No puedes editar esta vacuna');
    }

    return await this.vacunasService.update(id, vacunasData);
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number, @Request() request): Promise<{ message: string }> {
    const vacuna = await this.vacunasService.findOne(id);

    if (!request.user.admin && vacuna.mascota.refugio.usuario.id !== request.user.id) {
      throw new ForbiddenException('No puedes eliminar esta vacuna');
    }

    await this.vacunasService.remove(id);
    return { message: `Vacuna con ID ${id} eliminada correctamente` };
  }

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Get('mascota/:id_mascota')
  async findByMascota(@Param('id_mascota', ParseIntPipe) id_mascota: number, @Request() request): Promise<Vacunas[]> {
    const mascota = await this.mascotaService.findOne(id_mascota);

    if (!request.user.admin && mascota.refugio.usuario.id !== request.user.id) {
      throw new ForbiddenException('No puedes ver las vacunas de esta mascota');
    }

    return await this.vacunasService.findByMascota(id_mascota);
  }
}
