import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  senha: string; // Mudado de 'password' para 'senha' para corresponder ao backend
  userType?: 'cliente' | 'profissional';
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    nome: string; // Mudado de 'name' para 'nome' para corresponder ao backend
    tipo: 'cliente' | 'profissional'; // Mudado de 'type' para 'tipo' para corresponder ao backend
    cpf?: string;
    birthDate?: string;
    cell?: string;
    address?: string;
    especialidade?: string;
    admin?: boolean;
    cnec?: number;
  };
}

export interface RegisterRequest {
  email: string;
  nome: string; // Mudado de 'name' para 'nome' para corresponder ao backend
  senha: string; // Mudado de 'password' para 'senha' para corresponder ao backend
  tipo: 'cliente' | 'profissional'; // Mudado de 'type' para 'tipo' para corresponder ao backend
  cpf: string;
  birthDate: string;
  cell: string;
  address: string;
  especialidade?: string;
  admin?: boolean;
  cnec?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // URL do backend NestJS
  private tokenKey = 'essenza_access_token';
  private refreshTokenKey = 'essenza_refresh_token';
  private userKey = 'essenza_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Só verificar status de autenticação se estiver no browser
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus();
    }
  }

  // Verificar se está no browser antes de acessar localStorage
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Verificar status de autenticação ao inicializar
  private checkAuthStatus(): void {
    if (!this.isBrowser()) return;

    const token = this.getAccessToken();
    const userStr = localStorage.getItem(this.userKey);
    const user = userStr ? JSON.parse(userStr) : null;

    if (token && user) {
      // Verificar se o token ainda é válido
      if (!this.isTokenExpired()) {
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(user);
      } else {
        // Token expirado, tentar fazer refresh
        this.tryRefreshToken();
      }
    } else {
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  // Login de cliente
  loginCliente(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.handleLoginSuccess(response)),
      catchError(error => this.handleLoginError(error))
    );
  }

  // Login de profissional
  loginProfissional(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login-profissional`, credentials).pipe(
      tap(response => this.handleLoginSuccess(response)),
      catchError(error => this.handleLoginError(error))
    );
  }

  // Registro de usuário
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      catchError(error => this.handleLoginError(error))
    );
  }

  // Refresh do token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(response => this.handleRefreshSuccess(response)),
      catchError(error => this.handleRefreshError(error))
    );
  }

  // Verificar token
  verifyToken(): Observable<any> {
    const token = this.getAccessToken();
    if (!token) {
      return throwError(() => new Error('No access token available'));
    }

    return this.http.get(`${this.apiUrl}/auth/verify`).pipe(
      catchError(error => this.handleVerifyError(error))
    );
  }

  // Obter perfil do usuário
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`).pipe(
      catchError(error => this.handleProfileError(error))
    );
  }

  // Logout
  logout(): void {
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Obter usuário atual
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // Obter token de acesso
  getAccessToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.tokenKey);
  }

  // Obter token de refresh
  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Verificar se o token expirou
  isTokenExpired(): boolean {
    if (!this.isBrowser()) return true;

    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Verificar se o usuário é profissional
  isProfissional(): boolean {
    const user = this.getCurrentUser();
    return user && user.tipo === 'profissional';
  }

  // Verificar se o usuário é cliente
  isCliente(): boolean {
    const user = this.getCurrentUser();
    return user && user.tipo === 'cliente';
  }

  // Verificar se o usuário é admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.tipo === 'profissional' && user.admin === true;
  }

  // Manipular sucesso do login
  private handleLoginSuccess(response: LoginResponse): void {
    console.log('🔍 Debug - Login response:', response);
    console.log('🔍 Debug - User type:', response.user.tipo);
    
    this.setAuthData(response.access_token, response.refresh_token, response.user);
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(response.user);

    // Redirecionar baseado no tipo de usuário
    if (response.user.tipo === 'profissional') {
      console.log('🔍 Debug - Redirecionando para dashboard profissional');
      this.router.navigate(['/dashboard-profissional']);
    } else {
      console.log('🔍 Debug - Redirecionando para home normal');
      this.router.navigate(['/']); // Clientes vão para home normal
    }
  }

  // Manipular sucesso do refresh
  private handleRefreshSuccess(response: any): void {
    if (response.access_token) {
      const currentUser = this.getCurrentUser();
      const refreshToken = this.getRefreshToken();

      if (refreshToken && currentUser) {
        this.setAuthData(response.access_token, refreshToken, currentUser);
      }
    }
  }

  // Armazenar dados de autenticação
  private setAuthData(accessToken: string, refreshToken: string, user: any): void {
    if (!this.isBrowser()) return;

    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Limpar dados de autenticação
  private clearAuthData(): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Manipular erros de login
  private handleLoginError(error: any): Observable<never> {
    console.error('Login error:', error);
    return throwError(() => error);
  }

  // Manipular erros de refresh
  private handleRefreshError(error: any): Observable<never> {
    console.error('Refresh token error:', error);
    this.logout(); // Logout se o refresh falhar
    return throwError(() => error);
  }

  // Manipular erros de verificação
  private handleVerifyError(error: any): Observable<never> {
    console.error('Token verification error:', error);
    return throwError(() => error);
  }

  // Manipular erros de perfil
  private handleProfileError(error: any): Observable<never> {
    console.error('Profile error:', error);
    return throwError(() => error);
  }

  // Interceptor para adicionar token às requisições
  getAuthHeaders(): { [key: string]: string } {
    const token = this.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Verificar se precisa fazer refresh do token
  shouldRefreshToken(): boolean {
    if (!this.isBrowser()) return false;

    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;

      // Refresh se faltar menos de 5 minutos para expirar
      return timeUntilExpiry < 300;
    } catch (error) {
      return true;
    }
  }

  // Tentar fazer refresh do token
  private tryRefreshToken(): void {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.log('🔍 AuthService - Nenhum refresh token encontrado');
      this.logout();
      return;
    }

    this.refreshToken().subscribe({
      next: (response) => {
        console.log('🔍 AuthService - Token renovado com sucesso');
        this.handleLoginSuccess(response);
      },
      error: (error) => {
        console.log('🔍 AuthService - Erro ao renovar token:', error);
        this.logout();
      }
    });
  }

  // Atualizar dados do usuário atual
  updateCurrentUser(userData: any): void {
    this.currentUserSubject.next(userData);
    if (this.isBrowser()) {
      localStorage.setItem(this.userKey, JSON.stringify(userData));
    }
  }
}
