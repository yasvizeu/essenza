import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Protocolo {
  sort(arg0: (a: any, b: any) => number): Protocolo | null {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  //steps = relaçao com o pivot
  @OneToMany('ProtocoloServico', (ps: any) => ps.protocolo, { cascade: true })
  servicos: any[];
  steps: Protocolo | null;
}
