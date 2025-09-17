import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "../usuario/usuario.entity";

@Entity()
export class Notificaciones {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, usuario => usuario.notificaciones, { onDelete: 'CASCADE' })
  usuario: Usuario;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ type: 'boolean', default: false })
  leido: boolean;

  @Column({ type: 'timestamp' })
  fecha: Date;
}
