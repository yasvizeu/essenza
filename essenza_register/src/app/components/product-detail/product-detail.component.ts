import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  id!: string;
  title = 'Serviço de Bem-Estar';
  price = 350.00;
  description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus, purus sed dictum
  faucibus, erat lectus volutpat elit, id facilisis odio metus at lacus. Integer vulputate efficitur mi,
  a lacinia odio suscipit a.`;

  constructor(private route: ActivatedRoute, private router: Router, private booking: BookingService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    // Se desejar, mapeie títulos/prices por id aqui
  }

  addToCart(): void {
    // Marca o serviço escolhido para o fluxo de agendamento
    this.booking.setSelectedService(this.title);
    this.router.navigate(['/cart']);
  }
}


