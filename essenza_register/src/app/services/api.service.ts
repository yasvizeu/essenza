import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL = environment.apiUrl;

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
    return this.http.get<User[]>(`${this.API_BASE_URL}/profissional`);
  }

  getProfissionalById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_BASE_URL}/profissional/${id}`);
  }

  createProfissional(profissionalData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.API_BASE_URL}/profissional`, profissionalData);
  }

  updateProfissional(id: number, profissionalData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_BASE_URL}/profissional/${id}`, profissionalData);
  }

  deleteProfissional(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/profissional/${id}`);
  }

  // Produtos
  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/produto`);
  }

  getProdutoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/produto/${id}`);
  }

  createProduto(produtoData: any): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/produto`, produtoData);
  }

  updateProduto(id: number, produtoData: any): Observable<any> {
    return this.http.put<any>(`${this.API_BASE_URL}/produto/${id}`, produtoData);
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/produto/${id}`);
  }

  // Fichas de Anamnese
  getFichasAnamnese(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE_URL}/ficha-anamnese`);
  }

  getFichaAnamneseById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE_URL}/ficha-anamnese/${id}`);
  }

  createFichaAnamnese(fichaData: any): Observable<any> {
    return this.http.post<any>(`${this.API_BASE_URL}/ficha-anamnese`, fichaData);
  }

  updateFichaAnamnese(id: number, fichaData: any): Observable<any> {
    return this.http.put<any>(`${this.API_BASE_URL}/ficha-anamnese/${id}`, fichaData);
  }

  deleteFichaAnamnese(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/ficha-anamnese/${id}`);
  }
}
