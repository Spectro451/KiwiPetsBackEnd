import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "../usuario/usuario.entity";
import { Mascota } from "../mascota/mascota.entity";
import { Adopcion } from "../adopcion/adopcion.entity";

@Entity()
export class Refugio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  nombre: string;

  @Column({ type: "varchar", length: 255 })
  direccion: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  comuna?: string;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitud?: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitud?: number;
  
  @Column({ type: "varchar", length: 255 })
  telefono: string;

  @Column({ type: "boolean", default: false })
  validado: boolean;

  @OneToOne(() => Usuario, usuario => usuario.refugio, { onDelete: 'CASCADE' })
  @JoinColumn()
  usuario: Usuario;

  @OneToMany(() => Mascota, mascota => mascota.refugio, { cascade: true, onDelete: 'CASCADE' })
  mascotas?: Mascota[];

  @OneToMany(() => Adopcion, adopcion => adopcion.refugio, { cascade: true, onDelete: 'CASCADE' })
  adopciones?: Adopcion[];
}
