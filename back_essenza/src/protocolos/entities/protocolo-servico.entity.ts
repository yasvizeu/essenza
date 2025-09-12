// src/protocols/protocol-service.entity.ts  (pivot com atributos)
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique, Index } from 'typeorm';

@Entity('protocolo_servico')
@Unique(['protocolo', 'servico']) // não repetir o mesmo serviço no protocolo
@Unique(['protocolo', 'ordem'])   // manter ordem única dentro do protocolo
export class ProtocoloServico {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Protocolo', (p: any) => p.servicos, { onDelete: 'CASCADE' })
  @Index()
  protocolo: any;

  @ManyToOne('Servico', { onDelete: 'RESTRICT' })
  servico: any;

  @Column({ type: 'int' })
  ordem: number;

  @Column({ type: 'int', nullable: true })
  duracaoMin?: number; // opcional: duração prevista daquele passo

  @Column({ type: 'text', nullable: true })
  observacoes?: string;
}