import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface FichaAnamnese {
  id: number;
  healthProblems: string;
  medications: string;
  allergies: string;
  surgeries: string;
  lifestyle: string;
  createdAt: string;
  updatedAt: string;
  cliente: {
    id: number;
    name: string;
    email: string;
    cpf: string;
    birthDate: string;
    cell: string;
    address: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FichaAnamneseService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getFichaAnamneseByClienteId(clienteId: number): Observable<FichaAnamnese> {
    console.log('🔄 FichaAnamneseService - Buscando ficha para cliente ID:', clienteId);
    const headers = this.authService.getAuthHeaders();
    console.log('🔄 FichaAnamneseService - Headers de autenticação:', headers);
    const url = `${this.apiUrl}/fichas/cliente/${clienteId}`;
    console.log('🔄 FichaAnamneseService - URL da requisição:', url);
    
    return this.http.get<FichaAnamnese>(url, { headers });
  }

  createFichaAnamnese(fichaData: Partial<FichaAnamnese>): Observable<FichaAnamnese> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post<FichaAnamnese>(`${this.apiUrl}/fichas`, fichaData, { headers });
  }

  updateFichaAnamnese(id: number, fichaData: Partial<FichaAnamnese>): Observable<FichaAnamnese> {
    const headers = this.authService.getAuthHeaders();
    return this.http.patch<FichaAnamnese>(`${this.apiUrl}/fichas/${id}`, fichaData, { headers });
  }
}
