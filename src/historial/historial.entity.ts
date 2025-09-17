import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Mascota } from "../mascota/mascota.entity";

@Entity()
export class Historial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  descripcion: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @ManyToOne(() => Mascota, mascota => mascota.historialClinico, { onDelete: 'CASCADE' })
  mascota: Mascota;
}
