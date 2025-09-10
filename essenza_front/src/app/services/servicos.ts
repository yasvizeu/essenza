import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number | string; // Pode vir como string do DECIMAL do MySQL
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

  // Método para limpar cache e forçar reload
  clearCache(): void {
    this.servicosCache = [];
    this.servicosSubject.next([]);
  }

  // Buscar todos os serviços com cache e paginação
  getServicos(page: number = 1, limit: number = 20, categoria?: string): Observable<PaginatedResponse<Servico>> {
    // Busca do servidor
    const params: any = { 
      page: page.toString(), 
      limit: limit.toString(),
      _t: Date.now().toString() // Timestamp para evitar cache
    };
    if (categoria) params.categoria = categoria;

    console.log('🔄 ServicosService - Fazendo requisição para:', `${this.apiUrl}/servico`);
    console.log('🔄 ServicosService - Parâmetros:', params);
    
    return this.http.get<PaginatedResponse<Servico>>(`${this.apiUrl}/servico`, { 
      params
    }).pipe(
      tap(response => {
        console.log('✅ ServicosService - Resposta recebida:', response);
        console.log('✅ ServicosService - Dados:', response.data);
        console.log('✅ ServicosService - Quantidade:', response.data?.length);
        
        // Sempre atualizar o cache com os dados recebidos
        this.servicosCache = response.data;
        this.servicosSubject.next(response.data);
        
        console.log('✅ ServicosService - Cache atualizado:', this.servicosCache);
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
    return this.http.get<Servico>(`${this.apiUrl}/servico/${id}`);
  }

  // Buscar serviços por categoria
  getServicosByCategoria(categoria: string): Observable<Servico[]> {
    return this.http.get<Servico[]>(`${this.apiUrl}/servico?categoria=${categoria}`);
  }

  // Formatar preço
  formatPrice(price: number | string): string {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) {
      return 'R$ 0,00';
    }
    return `R$ ${numericPrice.toFixed(2).replace('.', ',')}`;
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
