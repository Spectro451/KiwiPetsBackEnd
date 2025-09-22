import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService){}

  @Get()
  @UseGuards(JwtAuthguard)
  async findAll(@Request() request): Promise<Usuario[]> {
    if (!request.user.admin) {
      throw new ForbiddenException('No tienes permiso');
    }
    return await this.usuarioService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthguard)
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() request): Promise<Usuario> {
    //si no sos admin ni el dueño del id, no puedes acceder
    if (!request.user.admin && request.user.id !== id) {
      throw new ForbiddenException('No tienes permiso para ver este usuario');
    }

    const usuario = await this.usuarioService.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  @Post()
  async create(@Body() usuarioData: Partial<Usuario>): Promise<Usuario> {
    return await this.usuarioService.create(usuarioData);
  }

  @UseGuards(JwtAuthguard)
  @Put(':id')
  async update(
    @Param('id',ParseIntPipe) id: number,
    @Body() usuarioData: Partial<Usuario>,
    @Request() request
  ): Promise<Usuario> {
    //bloqueo para no editar otros
    if (!request.user.admin && request.user.id !== id) {
      throw new ForbiddenException('No tienes permiso para actualizar este usuario');
    }
    //no permitir volverse admin
    if (!request.user.admin) {
      delete usuarioData.admin;
    }

    const updated = await this.usuarioService.update(id, usuarioData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar la usuario con ID ${id}`);
    }
    return updated;
  }

  @UseGuards(JwtAuthguard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() request): Promise<{ message: string }> {
    //bloqueo para no editar otros
    if (!request.user.admin && request.user.id !== id) {
      throw new ForbiddenException('No tienes permiso para borrar este usuario');
    }
    await this.usuarioService.remove(id);
    return { message: `Usuario con ID ${id} eliminada correctamente` };
  }

  @Post('login')
  async login(@Body() body:{correo:string;contraseña:string}){
    const { correo, contraseña} = body;
    return await this.usuarioService.loginUser(correo,contraseña)
  }
}
