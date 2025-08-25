import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroStateService } from '../../services/registro-state.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  cartItems = [
    { nome: 'Produto 1', quantidade: 2, preco: 49.90, imagem: 'https://blog.adcosprofissional.com.br/wp-content/uploads/2021/09/Profissional_pauta-4_produtos-ADCOS-1-scaled-e1630938241319.jpg' },
    { nome: 'Produto 2', quantidade: 1, preco: 79.90, imagem: 'https://blog.adcosprofissional.com.br/wp-content/uploads/2021/09/Profissional_pauta-4_produtos-ADCOS-1-scaled-e1630938241319.jpg' }
  ];


  constructor(private router: Router, private registro: RegistroStateService, private booking: BookingService) {}

  removerItem(item: any): void {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  calcularTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }

  mensagemFinal = '';
  finalizarCompra(): void {
    const user = this.registro.getDadosRegistro();
    if (!user) {
      alert('Faça login para finalizar a compra.');
      this.router.navigate(['/login']);
      return;
    }

    // Guarda itens para a seleção de horário
    this.booking.set({
      items: this.cartItems.map(i => ({ name: i.nome, quantity: i.quantidade, price: i.preco }))
    });

    // Vai para selecionar horário
    this.router.navigate(['/selecionar-horario']);
  }

}
