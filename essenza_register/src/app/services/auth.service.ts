import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.tokenKey);
  }

  isTokenExpired(token?: string | null): boolean {
    const t = token ?? this.getToken();
    if (!t) return true;
    try {
      const payload = JSON.parse(atob(t.split('.')[1] || ''));
      if (!payload || !payload.exp) return true;
      const nowSec = Math.floor(Date.now() / 1000);
      return payload.exp < nowSec;
    } catch {
      return true;
    }
  }

  decode<T = any>(token?: string | null): T | null {
    try {
      const t = token ?? this.getToken();
      if (!t) return null;
      return JSON.parse(atob(t.split('.')[1] || '')) as T;
    } catch { return null; }
  }
}


