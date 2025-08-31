import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";

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

  @OneToOne('Cliente', { eager: true })
  @JoinColumn()
  cliente: any;
}
