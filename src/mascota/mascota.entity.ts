import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Refugio } from "../refugio/refugio.entity";
import { Vacunas } from "../vacunas/vacunas.entity";
import { Historial} from "../historial/historial.entity";
import { Adopcion } from "../adopcion/adopcion.entity";
import { Favoritos } from "../favoritos/favoritos.entity";

export enum Tamaño{
  PEQUEÑO ='pequeño',
  MEDIANO ='mediano',
  GRANDE='grande',
}
export enum Especie {
  GATO = 'gato',
  PERRO = 'perro',
  AVE='ave',
  REPTIL='reptil',
  OTRO='otro',
}
export enum Genero {
  MASCULINO = 'masculino',
  FEMENINO = 'femenino',
}
export enum Estado{
  DISPONIBLE ='disponible',
  EN_PROCESO ='en proceso',
  ADOPTADO='adoptado',
}
@Entity()
export class Mascota{

  @PrimaryGeneratedColumn()
  id_mascota:number;

  @Column({type:"varchar",length:255})
  nombre:string;

  @Column({type:"varchar",length:255})
  raza:string;

  @Column({type:"int"})
  edad:number;

  @Column({type:"enum", enum:Tamaño})
  tamaño:Tamaño;

  @Column({type:"enum", enum:Especie})
  especie:Especie;

  @Column({type:"enum", enum:Genero})
  genero:Genero;

  @Column({type:"bool", default:false})
  vacunado:boolean;

  @Column({type:"bool", default:false})
  esterilizado:boolean;

  @Column({ type: "bool", default: false })
  posee_descendencia: boolean;

  @Column({type:"int"})
  veces_adoptado:number;

  @Column({ type: 'timestamp' })
  fecha_ingreso: Date;

  @Column({type:"bool", default:false})
  discapacidad:boolean;

  @Column({type:"text"})
  descripcion:string;

  @Column({type:"text"})
  personalidad:string;

  @Column({ type: 'varchar', nullable: true })
  foto: string | null;

  @Column({type:"varchar",length:255})
  requisito_adopcion:string;

  @Column({type:"enum", enum:Estado, default:Estado.DISPONIBLE})
  estado_adopcion:Estado;

  @ManyToOne(()=>Refugio, refugio=>refugio.mascotas, { onDelete: 'CASCADE' })
  refugio:Refugio; 

  @OneToMany(()=>Vacunas, vacunas=>vacunas.mascota, { cascade: true })
  vacunas:Vacunas[]

  @OneToMany(() => Historial, historial => historial.mascota, { cascade: true })
  historialClinico: Historial[];

  @OneToMany(() => Adopcion, adopcion => adopcion.mascota)
  adopciones: Adopcion[];

  @OneToMany(() => Favoritos, favorito => favorito.mascota)
  favoritos: Favoritos[];


}
