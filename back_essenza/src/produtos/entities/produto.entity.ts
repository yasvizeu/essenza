import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @Column({ length: 80, nullable: true })
  categoria?: string;

  @Column({ type: 'date', nullable: true })
  dataValidade?: string;

  @Column({ length: 10, default: 'ml', nullable: true })
  baseUnit: string;

  @OneToMany('ServicoProduto', (sp: any) => sp.produto)
  usedInServices: any[];

  @OneToMany('MovEstoque', (m: any) => m.produto)
  movements: any[];
}