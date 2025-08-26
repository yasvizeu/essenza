import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import { Persona } from "../../personas/entities/persona.entity";

@Entity()
export class Profissional extends Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  especialidade: string;

  @Column({ default: false })
  admin: boolean;

  @Column({ nullable: true })
  cnec: number;
}
