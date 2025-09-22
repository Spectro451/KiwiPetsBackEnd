import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Refugio } from "../refugio/refugio.entity";
import { Vacunas } from "../vacunas/vacunas.entity";
import { Historial} from "../historial/historial.entity";
import { Adopcion } from "../adopcion/adopcion.entity";
import { Favoritos } from "../favoritos/favoritos.entity";

export enum Tamaño{
  PEQUEÑO ='Pequeño',
  MEDIANO ='Mediano',
  GRANDE='Grande',
}
export enum Especie {
  GATO = 'Gato',
  PERRO = 'Perro',
  AVE='Ave',
  REPTIL='Reptil',
  OTRO='Otro',
}
export enum Genero {
  MASCULINO = 'Masculino',
  FEMENINO = 'Femenino',
}
export enum Estado{
  DISPONIBLE ='Disponible',
  EN_PROCESO ='En proceso',
  ADOPTADO='Adoptado',
}
@Entity()
export class Mascota{

  @PrimaryGeneratedColumn()
  id_mascota:number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  chip?: string | null;

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

  @Column({ type: "int", default: 0 })
  veces_adoptado: number;

  @Column({ type: 'timestamp' })
  fecha_ingreso: Date;

  @Column({type:"bool", default:false})
  discapacidad:boolean;

  @Column({type:"text"})
  descripcion:string;

  @Column({type:"text"})
  personalidad:string;

  @Column({ type: 'varchar', nullable: true })
  foto?: string | null;

  @Column({type:"varchar",length:255})
  requisito_adopcion:string;

  @Column({type:"enum", enum:Estado, default:Estado.DISPONIBLE})
  estado_adopcion:Estado;

  @ManyToOne(()=>Refugio, refugio=>refugio.mascotas, { onDelete: 'CASCADE' })
  refugio:Refugio; 

  @OneToMany(()=>Vacunas, vacunas=>vacunas.mascota, { cascade: true })
  vacunas?:Vacunas[]

  @OneToMany(() => Historial, historial => historial.mascota, { cascade: true })
  historialClinico?: Historial[];

  @OneToMany(() => Adopcion, adopcion => adopcion.mascota)
  adopciones?: Adopcion[];

  @OneToMany(() => Favoritos, favorito => favorito.mascota)
  favoritos?: Favoritos[];
}
