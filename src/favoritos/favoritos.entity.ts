import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Adoptante } from "../adoptante/adoptante.entity";
import { Mascota } from "../mascota/mascota.entity";

@Entity()
export class Favoritos {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Adoptante, adoptante => adoptante.favoritos, { onDelete: 'CASCADE' })
  adoptante: Adoptante;

  @ManyToOne(() => Mascota, mascota => mascota.favoritos, { onDelete: 'CASCADE' })
  mascota: Mascota;
}
