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

  /**
   * Cria um novo cliente no sistema.
   * @param clienteData Objeto com os dados do cliente (registro)
   */
  createClient(clienteData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/clientes`, clienteData);
  }

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

  /**
   * Cria um novo profissional no sistema.
   * @param professionalData Objeto com os dados do profissional
   */
  createProfessional(professionalData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profissionais`, professionalData);
  }

  /**
   * Busca todos os profissionais cadastrados.
   */
  getProfissionais(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profissionais`);
  }

  /**
   * Busca um profissional específico pelo ID.
   */
  getProfissionalById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profissionais/${id}`);
  }

  /**
   * Atualiza um profissional pelo ID.
   */
  updateProfissional(id: number, profissional: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profissionais/${id}`, profissional);
  }

  /**
   * Remove um profissional pelo ID.
   */
  deleteProfissional(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/profissionais/${id}`);
  }

  /**
   * Realiza login de usuário (cliente ou profissional).
   * @param loginData Objeto com email e senha
   */
  login(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/personas/login`, loginData);
  }
}