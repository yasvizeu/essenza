import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import { Cliente } from "src/clientes/entities/cliente.entity";

@Entity()
export class FichaAnamnese {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  healthProblems: string;

  @Column()
  medications: string;

  @Column()
  allergies: string;

  @Column()
  surgeries: string;

  @Column()
  lifestyle: string;

  @OneToOne(()=> Cliente, { eager: true })
  @JoinColumn()
  cliente:Cliente;
}
