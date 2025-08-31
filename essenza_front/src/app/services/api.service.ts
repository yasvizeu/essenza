import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL = 'http://localhost:3000'; // URL do backend

  constructor(private http: HttpClient) {}

  // Autenticação
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/login`, credentials);
  }

  loginProfissional(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/auth/login-profissional`, credentials);
  }

  refreshToken(refreshToken: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.API_BASE_URL}/auth/refresh`, { refreshToken });
  }

  // Usuários
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_BASE_URL}/auth/me`);
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_BASE_URL}/auth/profile`, userData);
  }

  // Clientes
  getClientes(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_BASE_URL}/clientes`);
  }

  getClienteById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_BASE_URL}/clientes/${id}`);
  }

  createCliente(clienteData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.API_BASE_URL}/clientes`, clienteData);
  }

  updateCliente(id: number, clienteData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_BASE_URL}/clientes/${id}`, clienteData);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/clientes/${id}`);
  }

  // Profissionais
  getProfissionais(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_BASE_URL}/profissionais`);
  }

  getProfissionalById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_BASE_URL}/profissionais/${id}`);
  }

  createProfissional(profissionalData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.API_BASE_URL}/profissionais`, profissionalData);
  }

  updateProfissional(id: number, profissionalData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.API_BASE_URL}/profissionais/${id}`, profissionalData);
  }

  deleteProfissional(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/profissionais/${id}`);
  }

  // Produtos
  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/produtos`);
  }

  getProdutoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/produtos/${id}`);
  }

  createProduto(produtoData: any): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/produtos`, produtoData);
  }

  updateProduto(id: number, produtoData: any): Observable<any> {
    return this.http.put<any>(`${this.API_BASE_URL}/produtos/${id}`, produtoData);
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/produtos/${id}`);
  }

  // Serviços
  getServicos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/servicos`);
  }

  getServicoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/servicos/${id}`);
  }

  createServico(servicoData: any): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/servicos`, servicoData);
  }

  updateServico(id: number, servicoData: any): Observable<any> {
    return this.http.put<any>(`${this.API_BASE_URL}/servicos/${id}`, servicoData);
  }

  deleteServico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/servicos/${id}`);
  }

  // Fichas de Anamnese
  getFichasAnamnese(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/fichas`);
  }

  getFichaAnamneseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/fichas/${id}`);
  }

  createFichaAnamnese(fichaData: any): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/fichas`, fichaData);
  }

  updateFichaAnamnese(id: number, fichaData: any): Observable<any> {
    return this.http.put<any>(`${this.API_BASE_URL}/fichas/${id}`, fichaData);
  }

  deleteFichaAnamnese(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/fichas/${id}`);
  }
}
