import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { User, LoginRequest, LoginResponse, AuthState } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    const user = this.getUser();

    if (token && user) {
      this.authStateSubject.next({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false
      });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);
    
    // Usar o ApiService para conectar com o backend real
    return this.apiService.login(credentials).pipe(
      tap(response => {
        this.setAuthData(response);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearAuthData();
    this.authStateSubject.next({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false
    });
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService.refreshToken(refreshToken).pipe(
      map(response => {
        this.setToken(response.token);
        return response.token;
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Verificar se o token não expirou
    try {
      const payload = this.decodeToken(token);
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.tipo === role;
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private setAuthData(response: LoginResponse): void {
    this.setToken(response.token);
    this.setRefreshToken(response.refreshToken);
    this.setUser(response.user);
    
    this.authStateSubject.next({
      user: response.user,
      token: response.token,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      isLoading: false
    });
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      isLoading: loading
    });
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  // Método para simular login (remover quando conectar com API real)
  loginSimulado(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);
    
    // Simulação de delay de API
    return of({
      user: {
        id: 1,
        email: credentials.email,
        nome: 'Usuário Teste',
        tipo: 'cliente' as const,
        cpf: '123.456.789-00'
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IlVzdcOhcmlvIFRlc3RlIiwiZXhwIjoxNzM1NjgwMDAwfQ.example',
      refreshToken: 'refresh_token_example',
      expiresIn: 3600
    }).pipe(
      tap(response => {
        this.setAuthData(response);
        this.setLoading(false);
      }),
      catchError(error => {
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }
}
