import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Profissional } from '../../profissional/entities/profissional.entity';
import { Servico } from '../../servicos/entities/servico.entity';

@Entity('agendamentos')
export class Agendamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  startDateTime: Date;

  @Column({ type: 'datetime' })
  endDateTime: Date;

  @Column({ type: 'varchar', length: 50, default: 'America/Sao_Paulo' })
  timeZone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ 
    type: 'enum', 
    enum: ['confirmed', 'tentative', 'cancelled'], 
    default: 'tentative' 
  })
  status: 'confirmed' | 'tentative' | 'cancelled';

  @Column({ 
    type: 'enum', 
    enum: ['pendente', 'pago', 'cancelado'], 
    default: 'pendente' 
  })
  statusPagamento: 'pendente' | 'pago' | 'cancelado';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  googleEventId: string;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column()
  clienteId: number;

  @ManyToOne(() => Profissional, { eager: true })
  @JoinColumn({ name: 'profissionalId' })
  profissional: Profissional;

  @Column()
  profissionalId: number;

  @ManyToOne(() => Servico, { eager: true })
  @JoinColumn({ name: 'servicoId' })
  servico: Servico;

  @Column()
  servicoId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
