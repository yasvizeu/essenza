import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EssenzaService } from '../../services/essenza.service';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.html',
  styleUrls: ['./estoque.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class Estoque implements OnInit {
  produtos: any[] = [];
  categorias: string[] = [];
  filtroCategoria: string = '';
  termoBusca: string = '';
  isLoading = false;
  
  // Estatísticas
  estatisticas: any = {};
  
  // Formulários
  produtoForm!: FormGroup;
  estoqueForm!: FormGroup;
  
  // Estados
  showAddProduto = false;
  showEditProduto = false;
  showEstoqueModal = false;
  produtoSelecionado: any = null;
  
  // Paginação
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private essenzaService: EssenzaService,
    private fb: FormBuilder
  ) {
    this.inicializarFormularios();
  }

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarEstatisticas();
    
    // Teste para verificar se o componente está funcionando
    console.log('Componente Estoque inicializado com sucesso!');
  }

  private inicializarFormularios(): void {
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['', Validators.required],
      preco: [null, [Validators.required, Validators.min(0)]],
      precoCusto: [null, [Validators.min(0)]],
      quantidade: [null, [Validators.required, Validators.min(0)]],
      quantidadeMinima: [null, [Validators.required, Validators.min(0)]],
      unidade: ['', Validators.required],
      codigoBarras: [''],
      fornecedor: [''],
      dataValidade: [''],
      lote: [''],
      imagem: ['']
    });

    this.estoqueForm = this.fb.group({
      quantidade: [null, [Validators.required, Validators.min(0)]],
      operacao: ['adicionar', Validators.required]
    });
  }

  carregarProdutos(): void {
    this.isLoading = true;
    this.essenzaService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.extrairCategorias();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.isLoading = false;
      }
    });
  }

  carregarEstatisticas(): void {
    this.essenzaService.getEstatisticasEstoque().subscribe({
      next: (stats) => {
        this.estatisticas = stats;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
      }
    });
  }

  private extrairCategorias(): void {
    const categoriasUnicas = new Set(this.produtos.map(p => p.categoria));
    this.categorias = Array.from(categoriasUnicas).sort();
  }

  filtrarPorCategoria(categoria: string): void {
    this.filtroCategoria = categoria;
    this.currentPage = 1;
  }

  buscarProdutos(): void {
    if (this.termoBusca.trim()) {
      this.essenzaService.buscarProdutos(this.termoBusca).subscribe({
        next: (produtos) => {
          this.produtos = produtos;
        },
        error: (error) => {
          console.error('Erro na busca:', error);
        }
      });
    } else {
      this.carregarProdutos();
    }
  }

  get produtosFiltrados(): any[] {
    let produtos = this.produtos;
    
    if (this.filtroCategoria) {
      produtos = produtos.filter(p => p.categoria === this.filtroCategoria);
    }
    
    return produtos;
  }

  get produtosPaginados(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.produtosFiltrados.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.produtosFiltrados.length / this.itemsPerPage);
  }

  mudarPagina(page: number): void {
    this.currentPage = page;
  }

  // ===== OPERAÇÕES DE PRODUTO =====

  adicionarProduto(): void {
    if (this.produtoForm.valid) {
      const produtoData = {
        ...this.produtoForm.value,
        profissionalId: 1 // TODO: Pegar ID do profissional logado
      };

      // Converter valores para números
      if (produtoData.preco) produtoData.preco = Number(produtoData.preco);
      if (produtoData.precoCusto) produtoData.precoCusto = Number(produtoData.precoCusto);
      if (produtoData.quantidade) produtoData.quantidade = Number(produtoData.quantidade);
      if (produtoData.quantidadeMinima) produtoData.quantidadeMinima = Number(produtoData.quantidadeMinima);

      this.essenzaService.createProduto(produtoData).subscribe({
        next: (response) => {
          console.log('Produto criado com sucesso:', response);
          this.produtoForm.reset();
          this.showAddProduto = false;
          this.carregarProdutos();
          this.carregarEstatisticas();
        },
        error: (error) => {
          console.error('Erro ao criar produto:', error);
          const mensagem = error.error?.message || 'Erro ao criar produto. Tente novamente.';
          alert(mensagem);
        }
      });
    }
  }

  editarProduto(produto: any): void {
    this.produtoSelecionado = produto;
    this.produtoForm.patchValue(produto);
    this.showEditProduto = true;
  }

  atualizarProduto(): void {
    if (this.produtoForm.valid && this.produtoSelecionado) {
      const produtoData = { ...this.produtoForm.value };
      
      // Converter valores para números
      if (produtoData.preco) produtoData.preco = Number(produtoData.preco);
      if (produtoData.precoCusto) produtoData.precoCusto = Number(produtoData.precoCusto);
      if (produtoData.quantidade) produtoData.quantidade = Number(produtoData.quantidade);
      if (produtoData.quantidadeMinima) produtoData.quantidadeMinima = Number(produtoData.quantidadeMinima);

      this.essenzaService.updateProduto(this.produtoSelecionado.id, produtoData).subscribe({
        next: (response) => {
          console.log('Produto atualizado com sucesso:', response);
          this.showEditProduto = false;
          this.produtoSelecionado = null;
          this.produtoForm.reset();
          this.carregarProdutos();
          this.carregarEstatisticas();
        },
        error: (error) => {
          console.error('Erro ao atualizar produto:', error);
          const mensagem = error.error?.message || 'Erro ao atualizar produto. Tente novamente.';
          alert(mensagem);
        }
      });
    }
  }

  excluirProduto(produto: any): void {
    if (confirm(`Tem certeza que deseja excluir o produto "${produto.nome}"?`)) {
      this.essenzaService.deleteProduto(produto.id).subscribe({
        next: () => {
          console.log('Produto excluído com sucesso');
          this.carregarProdutos();
          this.carregarEstatisticas();
        },
        error: (error) => {
          console.error('Erro ao excluir produto:', error);
          alert('Erro ao excluir produto. Tente novamente.');
        }
      });
    }
  }

  // ===== OPERAÇÕES DE ESTOQUE =====

  abrirModalEstoque(produto: any): void {
    this.produtoSelecionado = produto;
    this.estoqueForm.reset({ operacao: 'adicionar' });
    this.showEstoqueModal = true;
  }

  executarOperacaoEstoque(): void {
    if (this.estoqueForm.valid && this.produtoSelecionado) {
      const { quantidade, operacao } = this.estoqueForm.value;
      const quantidadeNum = Number(quantidade);
      
      let operacao$;
      if (operacao === 'adicionar') {
        operacao$ = this.essenzaService.adicionarEstoque(this.produtoSelecionado.id, quantidadeNum);
      } else if (operacao === 'remover') {
        operacao$ = this.essenzaService.removerEstoque(this.produtoSelecionado.id, quantidadeNum);
      } else {
        operacao$ = this.essenzaService.ajustarEstoque(this.produtoSelecionado.id, quantidadeNum);
      }

      operacao$.subscribe({
        next: (response) => {
          console.log('Operação de estoque realizada com sucesso:', response);
          this.showEstoqueModal = false;
          this.produtoSelecionado = null;
          this.estoqueForm.reset();
          this.carregarProdutos();
          this.carregarEstatisticas();
        },
        error: (error) => {
          console.error('Erro na operação de estoque:', error);
          const mensagem = error.error?.message || 'Erro na operação de estoque. Tente novamente.';
          alert(mensagem);
        }
      });
    }
  }

  // ===== UTILITÁRIOS =====

  getStatusEstoque(produto: any): string {
    if (produto.quantidade <= produto.quantidadeMinima) {
      return 'baixo';
    } else if (produto.quantidade <= produto.quantidadeMinima * 2) {
      return 'medio';
    } else {
      return 'bom';
    }
  }

  getStatusValidade(produto: any): string {
    if (!produto.dataValidade) return 'sem-data';
    
    const hoje = new Date();
    const validade = new Date(produto.dataValidade);
    const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes < 0) return 'vencido';
    if (diasRestantes <= 30) return 'vencendo';
    if (diasRestantes <= 90) return 'atencao';
    return 'ok';
  }

  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  }

  formatarData(data: string): string {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  }

  limparFiltros(): void {
    this.filtroCategoria = '';
    this.termoBusca = '';
    this.currentPage = 1;
    this.carregarProdutos();
  }
}
