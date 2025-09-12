import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrinho } from './entities/carrinho.entity';
import { Servico } from '../servicos/entities/servico.entity';
import { AdicionarAoCarrinhoDto, AtualizarCarrinhoDto, CarrinhoResumoDto } from './dto/carrinho.dto';

@Injectable()
export class CarrinhoService {
  constructor(
    @InjectRepository(Carrinho)
    private carrinhoRepository: Repository<Carrinho>,
    @InjectRepository(Servico)
    private servicoRepository: Repository<Servico>,
  ) {}

  // Adicionar item ao carrinho
  async adicionarAoCarrinho(clienteId: number, dto: AdicionarAoCarrinhoDto): Promise<Carrinho> {
    // Verificar se o serviço existe
    const servico = await this.servicoRepository.findOne({
      where: { id: dto.servicoId }
    });

    if (!servico) {
      throw new NotFoundException('Serviço não encontrado');
    }

    // Verificar se o item já existe no carrinho
    const itemExistente = await this.carrinhoRepository.findOne({
      where: {
        clienteId,
        servicoId: dto.servicoId
      }
    });

    if (itemExistente) {
      // Atualizar quantidade
      itemExistente.quantidade += dto.quantidade;
      itemExistente.precoTotal = itemExistente.quantidade * itemExistente.precoUnitario;
      return await this.carrinhoRepository.save(itemExistente);
    } else {
      // Criar novo item
      const novoItem = this.carrinhoRepository.create({
        clienteId,
        servicoId: dto.servicoId,
        quantidade: dto.quantidade,
        precoUnitario: servico.preco,
        precoTotal: servico.preco * dto.quantidade
      });

      return await this.carrinhoRepository.save(novoItem);
    }
  }

  // Obter carrinho do cliente
  async obterCarrinho(clienteId: number): Promise<CarrinhoResumoDto> {
    const items = await this.carrinhoRepository.find({
      where: { clienteId },
      relations: ['servico'],
      order: { createdAt: 'DESC' }
    });

    const total = items.reduce((sum, item) => sum + Number(item.precoTotal), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);

    return {
      items: items.map(item => ({
        id: item.id,
        servicoId: item.servicoId,
        servico: {
          id: item.servico.id,
          nome: item.servico.nome,
          descricao: item.servico.descricao,
          preco: item.servico.preco,
          duracao: item.servico.duracao,
          categoria: item.servico.categoria
        },
        quantidade: item.quantidade,
        precoUnitario: Number(item.precoUnitario),
        precoTotal: Number(item.precoTotal),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })),
      total,
      totalItems
    };
  }

  // Atualizar quantidade de um item
  async atualizarQuantidade(clienteId: number, itemId: number, dto: AtualizarCarrinhoDto): Promise<Carrinho> {
    const item = await this.carrinhoRepository.findOne({
      where: {
        id: itemId,
        clienteId
      }
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }

    item.quantidade = dto.quantidade;
    item.precoTotal = item.quantidade * Number(item.precoUnitario);

    return await this.carrinhoRepository.save(item);
  }

  // Remover item do carrinho
  async removerItem(clienteId: number, itemId: number): Promise<void> {
    const result = await this.carrinhoRepository.delete({
      id: itemId,
      clienteId
    });

    if (result.affected === 0) {
      throw new NotFoundException('Item não encontrado no carrinho');
    }
  }

  // Limpar carrinho
  async limparCarrinho(clienteId: number): Promise<void> {
    await this.carrinhoRepository.delete({ clienteId });
  }

  // Verificar se item está no carrinho
  async isItemNoCarrinho(clienteId: number, servicoId: number): Promise<boolean> {
    const item = await this.carrinhoRepository.findOne({
      where: {
        clienteId,
        servicoId
      }
    });

    return !!item;
  }

  // Obter quantidade de um item no carrinho
  async getQuantidadeItem(clienteId: number, servicoId: number): Promise<number> {
    const item = await this.carrinhoRepository.findOne({
      where: {
        clienteId,
        servicoId
      }
    });

    return item ? item.quantidade : 0;
  }
}
