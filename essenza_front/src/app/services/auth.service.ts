import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, map, of } from 'rxjs';
import { Router } from '@angular/router';
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
  public currentUser$ = this.authStateSubject.asObservable().pipe(
    tap(authState => authState.user)
  );

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    // Só inicializar se estivermos no browser
    if (isPlatformBrowser(this.platformId)) {
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
  }

  // Login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);

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

  // Login Profissional
  loginProfissional(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);

    return this.apiService.loginProfissional(credentials).pipe(
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

  // Logout
  logout(): void {
    this.clearAuthData();
    this.authStateSubject.next({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false
    });
    this.router.navigate(['/login']);
  }

    // Refresh Token
  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService.refreshToken(refreshToken).pipe(
      tap(response => {
        this.setToken(response.token);
      }),
      map(response => response.token),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Obter token atual
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Obter refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  // Obter tipo de usuário atual
  getUserType(): 'cliente' | 'profissional' | null {
    const user = this.getCurrentUser();
    console.log('🔍 Debug - getUserType - user:', user);
    console.log('🔍 Debug - getUserType - user.tipo:', user?.tipo);
    console.log('🔍 Debug - getUserType - user.type:', (user as any)?.type);
    return user ? (user.tipo || (user as any).type) : null;
  }

  // Verificar se é profissional
  isProfessional(): boolean {
    return this.getUserType() === 'profissional';
  }

  // Verificar se é cliente
  isClient(): boolean {
    return this.getUserType() === 'cliente';
  }

  // Redirecionar baseado no tipo de usuário
  redirectBasedOnUserType(): void {
    const userType = this.getUserType();
    console.log('🔍 Debug - getUserType():', userType);
    console.log('🔍 Debug - Current user:', this.getCurrentUser());

    if (userType === 'profissional') {
      console.log('🚀 Redirecionando para /home-profissional');
      this.router.navigate(['/home-profissional']);
    } else if (userType === 'cliente') {
      console.log('🚀 Redirecionando para /home-cliente');
      this.router.navigate(['/home-cliente']);
    } else {
      console.log('⚠️ Tipo não reconhecido, redirecionando para /');
      // Fallback para home se o tipo não for reconhecido
      this.router.navigate(['/']);
    }
  }

    // Obter usuário armazenado
  private getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      console.log('🔍 Debug - getUser - user original:', user);

      // Mapear campos do backend para o frontend
      const mappedUser: User = {
        ...user,
        nome: (user as any).name || user.nome, // Backend usa 'name', frontend usa 'nome'
        tipo: (user as any).type || user.tipo, // Backend usa 'type', frontend usa 'tipo'
      };

      console.log('🔍 Debug - getUser - user mapeado:', mappedUser);
      return mappedUser;
    } catch (error) {
      console.error('Erro ao parsear usuário:', error);
      return null;
    }
  }

  // Definir dados de autenticação
  private setAuthData(response: LoginResponse): void {
    console.log('🔍 Debug - setAuthData - response.user original:', response.user);

    // Mapear campos do backend para o frontend antes de salvar
    const mappedUser: User = {
      ...response.user,
              name: (response.user as any).name || response.user.name,
      tipo: (response.user as any).type || response.user.tipo,
    };

    console.log('🔍 Debug - setAuthData - user mapeado:', mappedUser);

    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(mappedUser));

    this.authStateSubject.next({
      user: mappedUser,
      token: response.token,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      isLoading: false
    });
  }

  // Definir token
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      token
    });
  }

  // Limpar dados de autenticação
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Definir loading
  private setLoading(isLoading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      isLoading
    });
  }

  // Verificar token no servidor
  verifyToken(): Observable<{ valid: boolean; user: User | null }> {
    return this.apiService.getCurrentUser().pipe(
      map(user => ({ valid: true, user })),
      catchError(() => of({ valid: false, user: null }))
    );
  }

  // Obter perfil do usuário
  getProfile(): Observable<User> {
    return this.apiService.getCurrentUser();
  }

  // Atualizar dados do usuário
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.apiService.updateProfile(userData).pipe(
      tap(user => {
        const currentState = this.authStateSubject.value;
        this.authStateSubject.next({
          ...currentState,
          user
        });
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      })
    );
  }
}
