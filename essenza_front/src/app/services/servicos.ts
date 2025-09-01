import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao?: number; // em minutos
  categoria?: string;
  imagem?: string;
  disponivel: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Buscar todos os serviços
  getServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}/servicos`);
  }

  // Buscar serviço por ID
  getServicoById(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/servicos/${id}`);
  }

  // Buscar serviços por categoria
  getServicosByCategoria(categoria: string): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}/servicos?categoria=${categoria}`);
  }

  // Formatar preço
  formatPrice(price: number): string {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  }

  // Formatar duração
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${remainingMinutes}min`;
      }
    }
  }
}
