import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { JwtAuthguard } from 'src/auth/jwt-auth.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService){}

  
  @Get()
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id:number): Promise<Usuario>{
    const usuario = await this.usuarioService.findOne(id);
    if(!usuario){
      throw new NotFoundException(`Usuario con ID ${id} no encontrada`);
    }
    return usuario;
  }

  @Post()
  async create(@Body() usuarioData: Partial<Usuario>): Promise<Usuario> {
    return await this.usuarioService.create(usuarioData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() usuarioData: Partial<Usuario>
  ): Promise<Usuario> {
    const updated = await this.usuarioService.update(id, usuarioData);
    if (!updated) {
      throw new NotFoundException(`No se pudo actualizar la usuario con ID ${id}`);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.usuarioService.remove(id);
    return { message: `Usuario con ID ${id} eliminada correctamente` };
  }

  @Post('login')
  async login(@Body() body:{correo:string;contraseña:string}){
    const { correo, contraseña} = body;
    return await this.usuarioService.loginUser(correo,contraseña)
  }
}
