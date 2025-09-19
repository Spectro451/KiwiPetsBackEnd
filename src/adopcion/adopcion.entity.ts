import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Adoptante } from "../adoptante/adoptante.entity";
import { Mascota } from "../mascota/mascota.entity";

export enum EstadoAdopcion {
  EN_PROCESO = "En proceso",
  ACEPTADA = "Aceptada",
  RECHAZADA = "Rechazada",
}

@Entity()
export class Adopcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Adoptante, adoptante => adoptante.adopciones, { onDelete: 'CASCADE' })
  adoptante: Adoptante;

  @ManyToOne(() => Mascota, mascota => mascota.adopciones, { onDelete: 'CASCADE' })
  mascota: Mascota;

  @Column({ type: 'timestamp' })
  fecha_solicitud: Date;

  @Column({ type: 'enum', enum: EstadoAdopcion, default: EstadoAdopcion.EN_PROCESO })
  estado: EstadoAdopcion;
}
