import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { Refugio } from '../refugio/refugio.entity';
import { Notificaciones } from '../notificaciones/notificaciones.entity';
import { Adoptante } from '../adoptante/adoptante.entity';

export enum TipoUsuario {
  ADOPTANTE = 'Adoptante',
  REFUGIO = 'Refugio',
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TipoUsuario })
  tipo: TipoUsuario;

  @Column({ type: 'varchar', length: 255, unique: true })
  correo: string;

  @Column({ type: 'varchar', length: 255 })
  contraseña: string;

  @Column({ type: 'bool', default: false })
  admin: boolean;

  @OneToMany(() => Notificaciones, notificacion => notificacion.usuario, { cascade: true, onDelete: 'CASCADE' })
  notificaciones?: Notificaciones[];

  @OneToOne(() => Adoptante, adoptante => adoptante.usuario, { cascade: true, onDelete: 'CASCADE', nullable: true })
  adoptante?: Adoptante;

  @OneToOne(() => Refugio, refugio => refugio.usuario, { cascade: true, onDelete: 'CASCADE', nullable: true })
  refugio?: Refugio;

}
