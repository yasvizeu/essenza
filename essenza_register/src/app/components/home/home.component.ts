import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegistroStateService } from '../../services/registro-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  userName: string | null = null;
  private sub?: Subscription;
  userType: string | null = null;

  constructor(private registro: RegistroStateService) {}

  ngOnInit(): void {
    this.sub = this.registro.dadosRegistro$.subscribe(user => {
      this.userName = user?.name ?? null;
      this.userType = user?.type ?? null;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
