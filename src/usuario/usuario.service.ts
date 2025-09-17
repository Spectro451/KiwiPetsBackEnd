import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  //Get
  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  //GetId
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return usuario;
  }

  //Post
  async create(data: Partial<Usuario>): Promise<Usuario> {
    //hasheo
    if (data.contraseña) {
      data.contraseña = await bcrypt.hash(data.contraseña, 10);
    }
    const nuevoUsuario = this.usuarioRepository.create(data);
    return this.usuarioRepository.save(nuevoUsuario);
  }

  //Put
  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.findOne(id);

    //hasheo post modificacion
    if (data.contraseña) {
      data.contraseña = await bcrypt.hash(data.contraseña, 10);
    }

    Object.assign(usuario, data);
    return this.usuarioRepository.save(usuario);
  }

  //delete
  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
  }
}
