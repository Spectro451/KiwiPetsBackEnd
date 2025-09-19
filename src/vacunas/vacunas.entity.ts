import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Mascota } from "../mascota/mascota.entity";

@Entity()
export class Vacunas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  nombre: string;

  @Column({ type: 'timestamp' })
  fecha_aplicacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  proxima_dosis?: Date;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @ManyToOne(() => Mascota, mascota => mascota.vacunas, { onDelete: 'CASCADE' })
  mascota: Mascota;
}
