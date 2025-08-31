import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MovEstoque } from './stock-movement.entity';
import { CreateMovementDto } from './dto/create-movement.dto';
import { ExecuteServiceDto } from './dto/execute-service.dto';
import { ServicoProduto } from 'src/servicos/entities/servico-produto.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(MovEstoque)
    private readonly movRepo: Repository<MovEstoque>,
    private readonly dataSource: DataSource,
  ) {}

   /** saldo = soma das quantidades de um produto */
  async saldoProduto(produtoId: number) {
    const { sum } = (await this.movRepo.createQueryBuilder('m')
      .select('COALESCE(SUM(m.quantidade), 0)', 'sum')
      .where('m.produtoId = :id', { id: produtoId })
      .getRawOne<{ sum: string }>()) ?? { sum: '0' };
    return Number(sum ?? 0);
  }

  /** listar extrato (últimos N movimentos) */
  extratoProduto(produtoId: number, limit = 50) {
    return this.movRepo.find({
      where: { produto: { id: produtoId } as any },
      order: { id: 'DESC' },
      take: limit,
      relations: ['produto'],
    });
  }

  /** cria um movimento avulso (entrada/ajuste/transferência etc.) */
  async lancarMovimento(dto: CreateMovementDto) {
    const mov = this.movRepo.create({
      produto: { id: dto.produtoId } as any,
      quantidade: String(dto.quantidade),
      motivo: dto.motivo,
      refTipo: dto.refTipo,
      refId: dto.refId,
    });
    return this.movRepo.save(mov);
  }

  /**
   * consome estoque conforme o BOM (lista de insumos) do serviço
   * - valida saldo (bloqueia negativo)
   * - cria movimentos negativos (saídas)
   */
  async executarServico(dto: ExecuteServiceDto) {
    return this.dataSource.transaction(async (manager) => {
      const pivotRepo = manager.getRepository(ServicoProduto);
      const movRepo   = manager.getRepository(MovEstoque);

      // carrega o BOM do serviço, já trazendo o produto
      const bom = await pivotRepo.find({
        where: { servico: { id: dto.servicoId } as any },
        relations: ['produto'],
      });
      if (!bom.length) {
        throw new Error('Serviço sem insumos (BOM) cadastrado.');
      }

      // 1) valida saldo de cada item
      for (const item of bom) {
        const precisa = Number(item.qtdPorServico) * dto.quantidade * (1 + Number(item.desperdicioPct ?? 0) / 100);
        const { sum } = (await movRepo.createQueryBuilder('m')
          .select('COALESCE(SUM(m.quantidade), 0)', 'sum')
          .where('m.produtoId = :pid', { pid: item.produto.id })
          .getRawOne<{ sum: string }>()) ?? { sum: '0' };
        const saldo = Number(sum ?? 0);
        if (saldo < precisa) {
          throw new Error(`Saldo insuficiente de ${item.produto.nome}. precisa ${precisa}, saldo ${saldo}`);
        }
      }

      // 2) lança as saídas
      const movimentos: MovEstoque[] = [];
      for (const item of bom) {
        const precisa = Number(item.qtdPorServico) * dto.quantidade * (1 + Number(item.desperdicioPct ?? 0) / 100);
        movimentos.push(movRepo.create({
          produto: { id: item.produto.id } as any,
          quantidade: String(-precisa), // negativo = saída
          motivo: 'execucao_servico',
          refTipo: dto.refTipo ?? 'ordem_servico',
          refId: dto.refId,
        }));
      }
      await movRepo.save(movimentos);
      return movimentos;
    });
  }

  /** estorna (cria um movimento inverso) */
  async estornar(movId: number) {
    const original = await this.movRepo.findOneByOrFail({ id: movId });
    const inverso = this.movRepo.create({
      produto: { id: (original as any).produto.id },
      quantidade: String(-Number(original.quantidade)),
      motivo: 'ajuste',
      refTipo: 'estorno',
      refId: String(original.id),
    });
    return this.movRepo.save(inverso);
  }
}
//o que está acontecendo: o serviço está consumindo produtos do estoque, e se não houver saldo suficiente, uma exceção é lançada.

//saldoProduto: faz um SUM(quantidade) direto no banco.

//lancarMovimento: cria uma linha no extrato (entrada/saída).

//executarServico: lê o BOM (pivot servico_produto), calcula quanto precisa, confere saldo e lança as saídas. Tudo em transação (ou falha tudo, ou grava tudo).

//estornar: cria o inverso do movimento (não apaga nem edita o original).