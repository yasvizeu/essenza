import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column,
  CreateDateColumn, Index
} from 'typeorm';

export type MotivoMov =
  | 'compra'
  | 'execucao_servico'
  | 'ajuste'
  | 'transferencia_entrada'
  | 'transferencia_saida';

@Entity('movimentos_estoque')
export class MovEstoque {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Produto', { onDelete: 'RESTRICT' })
  @Index()
  produto: any;

  // DECIMAL no MySQL vira string no TypeORM pra não perder precisão
  @Column('decimal', { precision: 12, scale: 3 })
  quantidade: string; // positivo = entrada, negativo = saída

  @Column({ length: 30 })
  motivo: MotivoMov;

  // campos de referência (opcionais) para rastrear de onde veio
  @Column({ length: 40, nullable: true })
  refTipo?: string; // ex.: 'ordem_servico'

  @Column({ length: 64, nullable: true })
  refId?: string;   // ex.: 'OS-123'

  @CreateDateColumn()
  criadoEm: Date;
}
//o que está acontecendo:

//@Entity('movimentos_estoque'): nome da tabela.

//produto: FK pro produto; onDelete: 'RESTRICT' impede apagar produto com movimentos.

//quantidade: decimal com 3 casas (p.ex. ml, g). string pra não dar bug de ponto flutuante.

//motivo/refTipo/refId: servem pra auditoria (saber de onde veio o movimento).

//criadoEm: timestamp automático.