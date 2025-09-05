import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao?: number; // em minutos
  categoria?: string;
  imagem?: string;
  disponivel?: boolean; // Temporariamente opcional
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
  private apiUrl = 'http://localhost:3000';
  private servicosCache: Servico[] | null = null;
  private servicosSubject = new BehaviorSubject<Servico[]>([]);
  public servicos$ = this.servicosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Buscar todos os serviços com cache e paginação
  getServicos(page: number = 1, limit: number = 20, categoria?: string): Observable<PaginatedResponse<Servico>> {
    // Se já temos os dados em cache e é a primeira página sem filtros, retorna imediatamente
    if (this.servicosCache && this.servicosCache.length > 0 && page === 1 && !categoria) {
      return of({
        data: this.servicosCache,
        pagination: {
          page: 1,
          limit: this.servicosCache.length,
          total: this.servicosCache.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      });
    }

    // Busca do servidor
    const params: any = { 
      page: page.toString(), 
      limit: limit.toString()
    };
    if (categoria) params.categoria = categoria;

    return this.http.get<PaginatedResponse<Servico>>(`${this.apiUrl}/servicos`, { params }).pipe(
      tap(response => {
        // Cache apenas a primeira página sem filtros
        if (page === 1 && !categoria) {
          this.servicosCache = response.data;
          this.servicosSubject.next(response.data);
        }
      }),
      catchError(error => {
        console.error('Erro ao carregar serviços:', error);
        return of({
          data: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        });
      })
    );
  }

  // Forçar atualização do cache
  refreshServicos(): Observable<PaginatedResponse<Servico>> {
    this.servicosCache = null;
    return this.getServicos();
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
