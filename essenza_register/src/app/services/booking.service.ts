import { Injectable } from '@angular/core';

export interface BookingItem {
  name: string;
  quantity: number;
  price: number;
}

export interface BookingPayload {
  items: BookingItem[];
  notes?: string;
  startIso?: string;
  endIso?: string;
  selectedServiceName?: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private current: BookingPayload | null = null;

  set(payload: BookingPayload): void {
    this.current = payload;
  }

  get(): BookingPayload | null {
    return this.current;
  }

  clear(): void {
    this.current = null;
  }

  setSelectedService(name: string): void {
    if (!this.current) this.current = { items: [] };
    this.current.selectedServiceName = name;
  }

  getSelectedService(): string | undefined {
    return this.current?.selectedServiceName;
  }
}


