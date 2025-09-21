import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AdopcionService } from './adopcion.service';
import { Adopcion } from './adopcion.entity';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('adopcion')
export class AdopcionController {
  constructor(private readonly adopcionService: AdopcionService) {}

  @UseGuards(JwtAuthguard, RolesGuard)
  @Roles('Refugio')
  @Get()
  async findAll(@Request() request): Promise<Adopcion[]> {
    if (request.user.admin) {
      return await this.adopcionService.findAll();
    }
    if (request.user.tipo === 'Refugio') {
      return await this.adopcionService.findByRefugio(request.user.id);
    }
    throw new ForbiddenException('No tienes permiso wuaja');
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Adopcion> {
    const adopcion = await this.adopcionService.findOne(id);
    if (!adopcion) {
      throw new NotFoundException(`Adopcion con ID ${id} no encontrada`);
    }
    return adopcion;
  }

  @Post()
  async create(@Body() adopcionData: Partial<Adopcion>): Promise<Adopcion> {
    return await this.adopcionService.create(adopcionData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() adopcionData: Partial<Adopcion>
  ): Promise<Adopcion> {
    const updated = await this.adopcionService.update(id, adopcionData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar la adopcion con ID ${id}`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.adopcionService.remove(id);
    return { message: `Adopcion con ID ${id} eliminada correctamente` };
  }
}
