import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notificaciones } from './notificaciones.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificaciones)
    private readonly notificacionesRepository: Repository<Notificaciones>,
  ) {}

  //Get
  async findAll(): Promise<Notificaciones[]> {
    return this.notificacionesRepository.find();
  }

  //GetId
  async findOne(id: number): Promise<Notificaciones> {
    const notificacion = await this.notificacionesRepository.findOne({
      where: { id },
      relations: ['usuario']
    });
    if (!notificacion) throw new NotFoundException(`Notificación con id ${id} no encontrada`);
    return notificacion;
  }

  //Post
  async create(data: Partial<Notificaciones>): Promise<Notificaciones> {
    const nuevaNotificacion = this.notificacionesRepository.create(data);
    return this.notificacionesRepository.save(nuevaNotificacion);
  }

  //Put
  async update(id: number, data: Partial<Notificaciones>): Promise<Notificaciones> {
    const notificaciones = await this.findOne(id);
    Object.assign(notificaciones, data);
    return this.notificacionesRepository.save(notificaciones);
  }

  //delete
  async remove(id: number): Promise<void> {
    const notificaciones = await this.findOne(id);
    await this.notificacionesRepository.remove(notificaciones);
  }

  //busca por usuario
  async findByUsuario(usuarioId:number):Promise<Notificaciones[]>{
    return this.notificacionesRepository.find({
      where: {usuario:{id:usuarioId}},
      order:{fecha:'DESC'}
    })
  }
}
