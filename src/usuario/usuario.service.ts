import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoUsuario, Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Refugio } from 'src/refugio/refugio.entity';
import { Adoptante, Edad, EspeciePreferida, Sexo, Vivienda } from 'src/adoptante/adoptante.entity';

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
    //ojo cuidado que tienes que dejar por defecto al crear los "vacios"
    if(nuevoUsuario.tipo===TipoUsuario.ADOPTANTE){
      const adoptante = this.adoptanteRepository.create({
        usuario:nuevoUsuario,
        rut:Date.now().toString(),
        nombre:"no tiene nombre",
        edad:0,
        telefono:"+56911111111",
        direccion:"no tengo direccion",
        cantidad_mascotas:0,
        especie_preferida:EspeciePreferida.CUALQUIERA,
        tipo_vivienda:Vivienda.CASA_PATIO,
        sexo:Sexo.CUALQUIERA,
        edad_buscada:Edad.ADULTO,
        motivo_adopcion:'I like trains',
      });
      await this.adoptanteRepository.save(adoptante);
      nuevoUsuario.adoptante = adoptante;
    } else if(nuevoUsuario.tipo===TipoUsuario.REFUGIO){
      const refugio = this.refugioRepository.create({
        usuario:nuevoUsuario,
        nombre:"No tiene nombre",
        direccion:"gpt-5",
        telefono:"+56912345678",
        validado:false,
      });
      await this.refugioRepository.save(refugio);
      nuevoUsuario.refugio = refugio;
    }

    return nuevoUsuario;
  }

  //Put
async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
  const usuario = await this.findOne(id);

  // Verificar si el correo ya está en uso por otro usuario
  if (data.correo) {
    const existente = await this.usuarioRepository.findOne({ 
      where: { correo: data.correo } 
    });
    if (existente && existente.id !== id) {
      throw new Error('El correo ya está en uso por otro usuario');
    }
  }

  // Hasheo de contraseña si se cambia
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
