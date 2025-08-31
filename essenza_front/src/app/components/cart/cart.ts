import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {
  cartItems = [
    { nome: 'Produto 1', quantidade: 2, preco: 49.90, imagem: 'https://blog.adcosprofissional.com.br/wp-content/uploads/2021/09/Profissional_pauta-4_produtos-ADCOS-1-scaled-e1630938241319.jpg' },
    { nome: 'Produto 2', quantidade: 1, preco: 79.90, imagem: 'https://blog.adcosprofissional.com.br/wp-content/uploads/2021/09/Profissional_pauta-4_produtos-ADCOS-1-scaled-e1630938241319.jpg' }
  ];


  removerItem(item: any): void {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  calcularTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }

  mensagemFinal = '';
finalizarCompra(): void {
  console.log('✅ Obrigado pela preferência!');
  console.log('🛒 Produtos comprados:');
  console.table(this.cartItems); // Mostra bonitinho em tabela

  this.mensagemFinal = '🛍️ Obrigado pela preferência! Sua compra foi finalizada com sucesso.';

 // Limpa o carrinho
  this.cartItems = [];

  // Opcional: zera o total
  // this.total = 0; // Se você tiver uma variável total
  setTimeout(() => {
  this.mensagemFinal = '';
}, 5000); // limpa a mensagem depois de 5 segundos
}

}
