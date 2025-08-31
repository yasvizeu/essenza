import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  email: string;
  nome: string; // Mudado de 'name' para 'nome'
  senha: string; // Mudado de 'password' para 'senha'
  tipo: 'cliente' | 'profissional'; // Mudado de 'type' para 'tipo'
  cpf: string;
  birthDate: string;
  cell: string;
  address: string;
  especialidade?: string;
  admin?: boolean;
  cnec?: number;
}

export interface FichaAnamnese {
  id?: number;
  healthProblems: string;
  medications: string;
  allergies: string;
  surgeries: string;
  lifestyle: string;
  clienteId?: number;
}

export interface ClienteCompleto {
  cliente: Cliente;
  fichaAnamnese: FichaAnamnese;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000'; // URL do backend NestJS

  constructor(private http: HttpClient) { }

  // Cadastrar cliente
  cadastrarCliente(cliente: Cliente): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, cliente);
  }

  // Cadastrar ficha de anamnese
  cadastrarFichaAnamnese(ficha: FichaAnamnese): Observable<any> {
    return this.http.post(`${this.apiUrl}/fichas`, ficha);
  }

  // Cadastrar cliente completo (cliente + ficha de anamnese)
  cadastrarClienteCompleto(clienteCompleto: ClienteCompleto): Observable<any> {
    // Primeiro cadastra o cliente
    return new Observable(observer => {
      this.cadastrarCliente(clienteCompleto.cliente).subscribe({
        next: (clienteResponse) => {
          // Depois cadastra a ficha de anamnese com o ID do cliente
          const ficha = {
            ...clienteCompleto.fichaAnamnese,
            clienteId: clienteResponse.id
          };

          this.cadastrarFichaAnamnese(ficha).subscribe({
            next: (fichaResponse) => {
              observer.next({
                cliente: clienteResponse,
                fichaAnamnese: fichaResponse
              });
              observer.complete();
            },
            error: (fichaError) => {
              observer.error(fichaError);
            }
          });
        },
        error: (clienteError) => {
          observer.error(clienteError);
        }
      });
    });
  }

  // Buscar cliente por ID
  buscarCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/clientes/${id}`);
  }

  // Buscar ficha de anamnese por ID do cliente
  buscarFichaAnamnese(clienteId: number): Observable<FichaAnamnese> {
    return this.http.get<FichaAnamnese>(`${this.apiUrl}/fichas?clienteId=${clienteId}`);
  }

  // Atualizar cliente
  atualizarCliente(id: number, cliente: Partial<Cliente>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  // Atualizar ficha de anamnese
  atualizarFichaAnamnese(id: number, ficha: Partial<FichaAnamnese>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/fichas/${id}`, ficha);
  }

  // Validar CPF
  validarCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let dv1 = resto < 2 ? 0 : resto;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let dv2 = resto < 2 ? 0 : resto;

    return parseInt(cpf.charAt(9)) === dv1 && parseInt(cpf.charAt(10)) === dv2;
  }

  // Validar email
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar celular
  validarCelular(celular: string): boolean {
    const celularRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
    return celularRegex.test(celular);
  }
}
