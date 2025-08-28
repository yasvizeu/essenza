// src/app/services/essenza.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class EssenzaService {

  private apiUrl = 'http://localhost:3000'; // ajuste para o endereço real da sua API

  constructor(private http: HttpClient) {}

  // ===== MÉTODOS PARA CLIENTES =====

  /**
   * Cria um novo cliente no sistema.
   * @param clienteData Objeto com os dados do cliente (registro)
   */
  createClient(clienteData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clientes`, clienteData);
  }

  /**
   * Login de cliente
   * @param loginData Objeto com email e senha
   */
  loginCliente(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clientes/login`, loginData);
  }

  // ===== MÉTODOS PARA PROFISSIONAIS =====

  /**
   * Cria um novo profissional no sistema.
   * @param profissionalData Objeto com os dados do profissional
   */
  createProfissional(profissionalData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profissional`, profissionalData);
  }

  /**
   * Login de profissional
   * @param loginData Objeto com email e senha
   */
  loginProfissional(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profissional/login`, loginData);
  }

  /**
   * Busca todos os profissionais cadastrados.
   */
  getProfissionais(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profissional`);
  }

  /**
   * Busca um profissional específico pelo ID.
   */
  getProfissionalById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profissional/${id}`);
  }

  /**
   * Atualiza um profissional pelo ID.
   */
  updateProfissional(id: number, profissional: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profissional/${id}`, profissional);
  }

  /**
   * Remove um profissional pelo ID.
   */
  deleteProfissional(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/profissional/${id}`);
  }

  // ===== MÉTODOS PARA PRODUTOS E ESTOQUE =====

  /**
   * Cria um novo produto no sistema.
   * @param produtoData Objeto com os dados do produto
   */
  createProduto(produtoData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/produtos`, produtoData);
  }

  /**
   * Busca todos os produtos cadastrados.
   */
  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos`);
  }

  /**
   * Busca um produto específico pelo ID.
   */
  getProdutoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produtos/${id}`);
  }

  /**
   * Atualiza um produto pelo ID.
   */
  updateProduto(id: number, produto: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/produtos/${id}`, produto);
  }

  /**
   * Remove um produto pelo ID.
   */
  deleteProduto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/produtos/${id}`);
  }

  /**
   * Busca produtos por categoria.
   */
  getProdutosPorCategoria(categoria: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos/categoria/${categoria}`);
  }

  /**
   * Busca produtos com estoque baixo.
   */
  getProdutosBaixoEstoque(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos/baixo-estoque`);
  }

  /**
   * Busca produtos próximos da data de validade.
   */
  getProdutosVencendo(dias: number = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos/vencendo?dias=${dias}`);
  }

  /**
   * Busca produtos inativos.
   */
  getProdutosInativos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos/inativos`);
  }

  /**
   * Busca estatísticas do estoque.
   */
  getEstatisticasEstoque(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produtos/estatisticas`);
  }

  /**
   * Busca produtos por termo de busca.
   */
  buscarProdutos(termo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos/buscar?termo=${termo}`);
  }

  // ===== OPERAÇÕES DE ESTOQUE =====

  /**
   * Adiciona quantidade ao estoque de um produto.
   */
  adicionarEstoque(produtoId: number, quantidade: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/produtos/${produtoId}/adicionar-estoque`, { quantidade });
  }

  /**
   * Remove quantidade do estoque de um produto.
   */
  removerEstoque(produtoId: number, quantidade: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/produtos/${produtoId}/remover-estoque`, { quantidade });
  }

  /**
   * Ajusta a quantidade de estoque de um produto.
   */
  ajustarEstoque(produtoId: number, quantidade: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/produtos/${produtoId}/ajustar-estoque`, { quantidade });
  }

  // ===== MÉTODOS EXISTENTES PARA CLIENTES =====

  /**
   * Cria uma nova ficha de anamnese para um cliente.
   * @param anamneseData Objeto com os dados da ficha de anamnese, incluindo o clienteId
   */
  createAnamnese(anamneseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/fichas`, anamneseData);
  }

  /**
   * Busca todos os clientes cadastrados.
   */
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clientes`);
  }

  /**
   * Busca um cliente específico pelo ID.
   */
  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes/${id}`);
  }

  /**
   * Atualiza um cliente pelo ID.
   */
  updateCliente(id: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  /**
   * Remove um cliente pelo ID.
   */
  deleteCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clientes/${id}`);
  }
}