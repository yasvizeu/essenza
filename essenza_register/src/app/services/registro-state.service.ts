import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroStateService {

  private dadosRegistroSource = new BehaviorSubject<any | null>(null);
  dadosRegistro$ = this.dadosRegistroSource.asObservable();

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const savedData = localStorage.getItem('registroCliente');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          this.dadosRegistroSource.next(parsedData);
        } catch (e) {
          console.error('Erro ao carregar dados do localStorage:', e);
          localStorage.removeItem('registroCliente');
        }
      }
    }
  }

  setDadosRegistro(dados: any): void {
    this.dadosRegistroSource.next(dados);
    if (this.isBrowser) {
      localStorage.setItem('registroCliente', JSON.stringify(dados));
    }
  }

  getDadosRegistro(): any | null {
    return this.dadosRegistroSource.getValue();
  }

  clearDadosRegistro(): void {
    this.dadosRegistroSource.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('registroCliente');
    }
  }
}
