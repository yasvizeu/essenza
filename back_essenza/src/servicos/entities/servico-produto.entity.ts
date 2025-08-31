import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";

// service-product.entity.ts  (pivot com atributos)
@Entity('servico_produtos')
export class ServicoProduto {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne('Servico', (s: any) => s.bom, { onDelete: 'CASCADE' })
  servico: any;

  @ManyToOne('Produto', (p: any) => p.usedInServices, { onDelete: 'RESTRICT' })
  produto: any;

  @Column('decimal', { precision: 10, scale: 3 })
  qtyPerService: number; // ex.: 12.5 ml

  @Column({ length: 10, default: 'ml' })
  unit: string;

  @Column('decimal', { precision: 10, scale: 3 })
  qtdPorServico: number; // ex.: 12.5 ml

  @Column({ length: 10, default: 'ml' })
  unidade: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  desperdicioPct: number; // opcional
}