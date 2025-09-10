import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Servico } from '../../servicos/entities/servico.entity';

@Entity('carrinho')
export class Carrinho {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column()
  clienteId: number;

  @ManyToOne(() => Servico, { eager: true })
  @JoinColumn({ name: 'servicoId' })
  servico: Servico;

  @Column()
  servicoId: number;

  @Column({ type: 'int', default: 1 })
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precoUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precoTotal: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
