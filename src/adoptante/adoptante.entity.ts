import { Entity, PrimaryColumn,Column, OneToMany } from "typeorm";
import { Adopcion } from "../adopcion/adopcion.entity";
import { Favoritos } from "../favoritos/favoritos.entity";

export enum Especie {
  GATO = 'gato',
  PERRO = 'perro',
  AVE='ave',
  REPTIL='reptil',
  CUALQUIERA='cualquiera',
}
export enum Vivienda {
  CASA_PATIO = 'casa con patio',
  CASA_NO_PATIO = 'casa sin patio',
  DEPTO_PATIO = 'departamento con patio',
  DEPTO_NO_PATIO = 'departamento sin patio',
}
export enum Sexo {
  MASCULINO = 'masculino',
  FEMENINO = 'femenino',
  CUALQUIERA = 'cualquiera',
}
export enum Edad {
  CACHORRO = 'cachorro',
  JOVEN = 'joven',
  ADULTO = 'adulto',
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

  @Column({type:"int"})
  cantidad_mascotas:number;

  @Column({type:'enum', enum:Especie})
  especie_preferida: Especie;

  @Column({type:'enum', enum:Vivienda})
  tipo_vivienda: Vivienda;

  @Column({type:'enum', enum:Sexo})
  sexo: Sexo;

  @Column({type:'enum', enum:Edad})
  edad_buscada: Edad;

  @Column({ type: "text" })
  motivo_adopcion: string;

  @OneToMany(() => Adopcion, adopcion => adopcion.adoptante)
  adopciones: Adopcion[];

  @OneToMany(() => Favoritos, favorito => favorito.adoptante)
  favoritos: Favoritos[];


}