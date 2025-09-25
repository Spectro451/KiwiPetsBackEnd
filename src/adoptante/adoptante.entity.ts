import { Entity, PrimaryColumn,Column, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { Adopcion } from "../adopcion/adopcion.entity";
import { Favoritos } from "../favoritos/favoritos.entity";
import { Usuario } from "../usuario/usuario.entity";

export enum EspeciePreferida {
  GATO = 'Gato',
  PERRO = 'Perro',
  AVE='Ave',
  REPTIL='Reptil',
  CUALQUIERA='Cualquiera',
}
export enum Vivienda {
  CASA_PATIO = 'Casa con patio',
  CASA_NO_PATIO = 'Casa sin patio',
  DEPTO_PATIO = 'Departamento con patio',
  DEPTO_NO_PATIO = 'Departamento sin patio',
}
export enum Sexo {
  MASCULINO = 'Masculino',
  FEMENINO = 'Femenino',
  CUALQUIERA = 'Cualquiera',
}
export enum Edad {
  CACHORRO = 'Cachorro',
  JOVEN = 'Joven',
  ADULTO = 'Adulto',
}
@Entity()
export class Adoptante{
  @PrimaryColumn({type:"varchar", length:100})
  rut: string;
  
  @Column({ type: "varchar", length: 255 })
  nombre: string;

  @Column({ type: "int" })
  edad: number;
  
  @Column({ type: "varchar", length: 255 })
  telefono: string;

  @Column({ type: "varchar", length: 255 })
  direccion: string;

  @Column({ type: "varchar", length: 3, nullable: true, default: 'No' })
  experiencia_mascotas: string;

  @Column({ type: "int", nullable: true })
  cantidad_mascotas?: number;

  @Column({type:'enum', enum:EspeciePreferida})
  especie_preferida: EspeciePreferida;

  @Column({type:'enum', enum:Vivienda})
  tipo_vivienda: Vivienda;

  @Column({type:'enum', enum:Sexo})
  sexo: Sexo;

  @Column({type:'enum', enum:Edad})
  edad_buscada: Edad;

  @Column({ type: "text" })
  motivo_adopcion: string;

  @OneToMany(() => Adopcion, adopcion => adopcion.adoptante, { cascade: true, onDelete: 'CASCADE' })
  adopciones?: Adopcion[];

  @OneToMany(() => Favoritos, favorito => favorito.adoptante, { cascade: true, onDelete: 'CASCADE' })
  favoritos?: Favoritos[];

  @OneToOne(() => Usuario, usuario => usuario.adoptante, { onDelete: 'CASCADE' })
  @JoinColumn()
  usuario: Usuario;

}