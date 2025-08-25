import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { EssenzaService } from './essenza.service';

@Injectable({ providedIn: 'root' })
export class TokenRefreshService {
  private timerId: any;
  private refreshing = false;

  constructor(private auth: AuthService, private api: EssenzaService) {}

  start(): void {
    this.stop();
    this.timerId = setInterval(() => this.tick(), 30_000); // verifica a cada 30s
  }

  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private tick(): void {
    const token = this.auth.getToken();
    if (!token || this.refreshing) return;
    const payload: any = this.auth.decode(token);
    if (!payload?.exp) return;
    const now = Math.floor(Date.now() / 1000);
    const secondsToExpire = payload.exp - now;
    if (secondsToExpire <= 120) { // renova se faltar <= 2min
      this.refreshing = true;
      this.api.refreshToken().subscribe({
        next: ({ token: newToken }) => {
          this.auth.setToken(newToken);
          this.refreshing = false;
        },
        error: () => { this.refreshing = false; }
      });
    }
  }
}


