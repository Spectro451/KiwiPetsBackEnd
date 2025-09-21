import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoUsuario, Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Refugio } from 'src/refugio/refugio.entity';
import { Adoptante } from 'src/adoptante/adoptante.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Refugio)
    private readonly refugioRepository: Repository<Refugio>,
    @InjectRepository(Adoptante)
    private readonly adoptanteRepository: Repository<Adoptante>,
    private readonly jwtService: JwtService,
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
    await this.usuarioRepository.save(nuevoUsuario);

    if(nuevoUsuario.tipo===TipoUsuario.ADOPTANTE){
      nuevoUsuario.adoptante = this.adoptanteRepository.create({usuario:nuevoUsuario});
    } else if(nuevoUsuario.tipo===TipoUsuario.REFUGIO){
      nuevoUsuario.refugio=this.refugioRepository.create({usuario:nuevoUsuario});
    }

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

  //login
  async loginUser(correo:string, contraseña:string): Promise<{id:number;tipo:string, token:string, admin:boolean}>{
    const usuario = await this.usuarioRepository.findOne({where:{correo}});

    if (!usuario){
      throw new NotFoundException('Usuario no existe');
    }
    
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida){
      throw new NotFoundException('Correo o contraseña incorrectos');
    }
    
    const payload = {id:usuario.id, tipo:usuario.tipo, admin:usuario.admin};
    const token = this.jwtService.sign(payload);

    return {token,id:usuario.id, tipo:usuario.tipo, admin:usuario.admin};
  }
}
