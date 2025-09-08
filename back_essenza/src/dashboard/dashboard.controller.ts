import { Controller, Get, Query } from '@nestjs/common';
import { ProdutosService } from '../produtos/produtos.service';
import { ServicosService } from '../servicos/servicos.service';
import { ClientesService } from '../clientes/clientes.service';
import { InventarioService } from '../estoque/inventario.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly produtosService: ProdutosService,
    private readonly servicosService: ServicosService,
    private readonly clientesService: ClientesService,
    private readonly inventarioService: InventarioService,
  ) {}

  @Get('estatisticas')
  async getEstatisticas() {
    try {
      const [produtos, servicosResponse, clientes] = await Promise.all([
        this.produtosService.findAll(),
        this.servicosService.findAll(),
        this.clientesService.findAll(),
      ]);

      // Calcular produtos com baixo estoque (menos de 10 unidades)
      let produtosBaixoEstoque = 0;
      for (const produto of produtos) {
        const saldo = await this.inventarioService.saldoProduto(produto.id);
        if (saldo < 10) {
          produtosBaixoEstoque++;
        }
      }

      // Contar movimentações de hoje
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);

      // Buscar movimentações de hoje (simulado - você pode implementar isso no InventarioService)
      const movimentacoesHoje = 0; // Implementar lógica real

      return {
        totalClientes: clientes.length,
        totalProdutos: produtos.length,
        totalServicos: servicosResponse.pagination.total,
        produtosBaixoEstoque,
        movimentacoesHoje,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        totalClientes: 0,
        totalProdutos: 0,
        totalServicos: 0,
        produtosBaixoEstoque: 0,
        movimentacoesHoje: 0,
      };
    }
  }

  @Get('produtos-baixo-estoque')
  async getProdutosBaixoEstoque() {
    try {
      const produtos = await this.produtosService.findAll();
      const produtosComSaldo: any[] = [];
      
      for (const produto of produtos) {
        const saldo = await this.inventarioService.saldoProduto(produto.id);
        if (saldo < 10) {
          produtosComSaldo.push({
            ...produto,
            saldoAtual: saldo
          });
        }
      }
      
      return produtosComSaldo;
    } catch (error) {
      console.error('Erro ao buscar produtos com baixo estoque:', error);
      return [];
    }
  }

  @Get('ultimas-movimentacoes')
  async getUltimasMovimentacoes(@Query('limit') limit = 10) {
    try {
      // Implementar lógica real para buscar últimas movimentações
      // Por enquanto, retornando array vazio
      return [];
    } catch (error) {
      console.error('Erro ao buscar últimas movimentações:', error);
      return [];
    }
  }
}
