import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  standalone: true
})
export class Header implements OnInit, OnDestroy {
  isAuthenticated = false;
  currentUser: any = null;
  cartItemCount = 0;
  private authSubscription: Subscription = new Subscription();
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription.add(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      })
    );

    this.authSubscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );

    // Subscrever ao carrinho para atualizar o contador
    this.cartSubscription.add(
      this.cartService.cart$.subscribe(cart => {
        this.cartItemCount = cart.totalItems;
      })
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  goToMeusAgendamentos(): void {
    this.router.navigate(['/cliente-agendamentos']);
  }

  goToDashboardProfissional(): void {
    this.router.navigate(['/dashboard-profissional']);
  }
}
