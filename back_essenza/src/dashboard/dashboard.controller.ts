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
      // Usar Promise.all para executar queries em paralelo
      const saldosPromises = produtos.map(produto => 
        this.inventarioService.saldoProduto(produto.id)
      );
      const saldos = await Promise.all(saldosPromises);
      
      const produtosBaixoEstoque = saldos.filter(saldo => saldo < 10).length;

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
      
      // Usar Promise.all para executar queries em paralelo
      const saldosPromises = produtos.map(produto => 
        this.inventarioService.saldoProduto(produto.id)
      );
      const saldos = await Promise.all(saldosPromises);
      
      const produtosComSaldo = produtos
        .map((produto, index) => ({
          ...produto,
          saldoAtual: saldos[index]
        }))
        .filter(produto => produto.saldoAtual < 10);
      
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
